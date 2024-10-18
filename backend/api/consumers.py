import logging
import urllib.parse
import httpx
import json
import asyncio
import random
import os
import time

from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from asgiref.sync import sync_to_async, async_to_sync

from django.db.models import Q, Count
from django.utils import timezone

from .models import Conversation, User, Relationship, Match, UserSettings
from .util import generate_id, get_safe_profile, get_user_id_from_token
from .serializers import UserSerializer, MatchSerializer, UserSettingsSerializer

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class StatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = None
        self.heartbeat_task = None
        self.failed_heartbeats = 0
        self.first_heartbeat = True

        query_string = self.scope['query_string'].decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token is None:
            logger.info(f"[{self.__class__.__name__}] Connection attempt without token")
            await self.close()
            return

        userID = await get_user_id_from_token(token)

        if userID is None:
            logger.info(f"[{self.__class__.__name__}] Connection attempt with invalid token")
            await self.close()
            return

        try:
            self.user = await sync_to_async(User.objects.get)(userID=userID)
        except User.DoesNotExist:
            logger.info(f"[{self.__class__.__name__}] User {userID} not found")
            await self.close()
            return

        self.user_group_name = f"status_{self.user.userID}"

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()
        self.heartbeat_task = asyncio.create_task(self.check_heartbeat())
        logger.info(f"[{self.__class__.__name__}] User {self.user.username} connected")

    async def disconnect(self, close_code):
        if self.heartbeat_task and not self.heartbeat_task.done():
            self.heartbeat_task.cancel()
        if self.user is not None:
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
            await self.update_user_status(False, None)
            await self.notify_friends_connection(self.user)
            logger.info(f"[{self.__class__.__name__}] User {self.user.username} disconnected")

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            message_type = json_data.get("type", None)

            if not message_type:
                raise Exception("Missing message type")

            match message_type:
                case "heartbeat":
                    activity = json_data.get("activity", None)

                    if activity is None:
                        raise Exception("Missing activity")
                    if activity not in ["HOME", "QUEUEING", "PLAYING_VS_AI", "PLAYING_MULTIPLAYER", "PLAYING_LOCAL"]:
                        raise Exception("Invalid activity, not in [HOME, QUEUEING, PLAYING_VS_AI, PLAYING_MULTIPLAYER, PLAYING_LOCAL]")

                    self.failed_heartbeats = 0
                    await self.update_user_status(True, activity)

                    if self.first_heartbeat:
                        await self.notify_friends_connection(self.user)
                        self.first_heartbeat = False

                case _:
                    raise Exception(f"Invalid message type: {message_type}")

        except Exception as err:
            await self.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON",
                "more_info": str(err)
            }))

    @sync_to_async
    def update_user_status(self, online, activity):
        try:
            self.user = User.objects.get(userID=self.user.userID)
        except User.DoesNotExist:
            return

        self.user.status = {
            "online": online,
            "activity": activity,
            "last_seen": timezone.now().isoformat()
        }
        self.user.save()

    async def notify_friends_connection(self, user):
        friends = await sync_to_async(list)(
            Relationship.objects.filter(
                Q(userA=user.userID) | Q(userB=user.userID),
                status=1
            )
        )

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != user.userID else relationship.userB

            try:
                friend = await sync_to_async(User.objects.get)(userID=friend_id)
            except User.DoesNotExist:
                continue

            await self.channel_layer.group_send(
                f"status_{friend.userID}",
                {
                    "type": "connection_event",
                    "user": get_safe_profile(UserSerializer(user).data, me=False)
                }
            )

    async def connection_event(self, event):
        await self.send(json.dumps({
            "type": "connection_event",
            "user": event["user"]
        }))

    async def check_heartbeat(self):
        while True:
            self.failed_heartbeats += 1

            if self.failed_heartbeats >= 3:
                logger.info(f"[{self.__class__.__name__}] User {self.user.username} missed 3 heartbeats, closing connection")
                await self.close(code=4000)
                break

            await self.send(json.dumps({
                "type": "heartbeat"
            }))
            await asyncio.sleep(2)

class ChatConsumer(AsyncWebsocketConsumer):


    async def connect(self):
        self.user = None

        query_string = self.scope['query_string'].decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token is None:
            logger.info(f"[{self.__class__.__name__}] Connection attempt without token")
            await self.close()
            return

        userID = await get_user_id_from_token(token)

        if userID is None:
            logger.info(f"[{self.__class__.__name__}] Connection attempt with invalid token")
            await self.close()
            return

        try:
            self.user = await sync_to_async(User.objects.get)(userID=userID)
        except User.DoesNotExist:
            logger.info(f"[{self.__class__.__name__}] User {userID} not found")
            await self.close()
            return

        self.user_group_name = f"chat_{self.user.userID}"

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        logger.info(f"[{self.__class__.__name__}] User {self.user.username} connected")
        await self.ensure_conversations_exist(self.user)
        logger.info(f"[{self.__class__.__name__}] User {self.user.username} conversations ensured")
        await self.accept()

    async def disconnect(self, close_code):
        if self.user:
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

            logger.info(f"[{self.__class__.__name__}] User {self.user.username} disconnected")

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            message_type = json_data.get("type", None)

            if not message_type:
                raise Exception("Missing message type")

            match message_type:
                case "send_message":
                    conversation_id = json_data.get("conversationID", None)
                    content = json_data.get("content", None)

                    if self.user is None:
                        raise Exception("Something went wrong when receiving the message")
                    if conversation_id is None:
                        raise Exception("Missing conversation ID")
                    if content is None:
                        raise Exception("Missing content")

                    logger.info(f"[{self.__class__.__name__}] Received message from {self.user.username}: {json_data}")
                    await self.add_message_to_conversation(conversation_id, self.user, content)
                    await self.notify_new_message(conversation_id, self.user.username, content)

                case _:
                    raise Exception(f"Invalid message type: {message_type}")
        except Exception as err:
            await self.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON",
                "more_info": str(err)
            }))

    async def notify_new_message(self, conversation_id, sender_username, message):
        conversation = await sync_to_async(Conversation.objects.get)(conversationID=conversation_id)

        if not conversation:
            raise Exception(f"Conversation {conversation_id} not found")

        participants = await sync_to_async(list)(conversation.participants.all())

        for participant in participants:
            participant_group_name = f"chat_{participant.userID}"

            await self.channel_layer.group_send(
                participant_group_name,
                {
                    "type": "conversation_update",
                    "senderUsername": sender_username,
                    "messagePreview": message[:32] + "..." if len(message) > 32 else message
                }
            )

    async def conversation_update(self, event):
        await self.send(json.dumps({
            "type": "conversation_update",
            "senderUsername": event["senderUsername"],
            "messagePreview": event["messagePreview"]
        }))

    async def friend_request(self, event):
        await self.send(json.dumps({
            "type": "friend_request",
            "status": event["status"],
            "data": event["data"]
        }))

    @sync_to_async
    def add_message_to_conversation(self, conversation_id, user, content):
        conversation = Conversation.objects.get(conversationID=conversation_id)

        if not conversation:
            raise Exception(f"Conversation {conversation_id} not found")

        if user not in conversation.participants.all():
            raise Exception(f"User {user.username} is not part of conversation {conversation_id}")

        conversation.messages.create(messageID=generate_id("msg"), sender=user, content=content)
        conversation.save()

    @sync_to_async
    def ensure_conversations_exist(self, user):
        friends = Relationship.objects.filter(
            Q(userA=user.userID) | Q(userB=user.userID)
        )
        friends = friends.exclude(
            Q(status=2) | Q(status=0),
            Q(userA=user.userID) | Q(userB=user.userID)
        )

        user = User.objects.get(userID=user.userID)

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != user.userID else relationship.userB

            try:
                friend = User.objects.get(userID=friend_id)
            except User.DoesNotExist:
                continue

            existing_conversation = Conversation.objects.filter(
                participants__userID__in=[user.userID, friend_id],
                conversationType='private_message'
            ).annotate(participant_count=Count('participants')).filter(participant_count=2).exists()

            if not existing_conversation:
                new_conversation = Conversation.objects.create(conversationID=generate_id("conv"), conversationType='private_message')
                new_conversation.receipientID = user.userID
                new_conversation.participants.add(user, friend)
                new_conversation.save()

class TournamentConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        logger.info(f"[{self.__class__.__name__}] New connection attempt")
        await self.accept()
        await self.send_json({
            "e": "HELLO",
            "d": {"heartbeat_interval": 1000}
        })
        self.last_heartbeat = time.time()
        self.heartbeat_task = asyncio.create_task(self.heartbeat_check())
        self.user = None
        self.tournament = None
        logger.info(f"[{self.__class__.__name__}] Connection accepted, heartbeat check task started")

    async def disconnect(self, close_code):
        logger.info(f"[{self.__class__.__name__}] Disconnecting with close code: {close_code}")
        if hasattr(self, 'heartbeat_task'):
            self.heartbeat_task.cancel()
        if self.user and self.tournament:
            await self.channel_layer.group_discard(
                f"tournament_{self.tournament.tournamentID}",
                self.channel_name
            )
        logger.info(f"[{self.__class__.__name__}] Disconnected, cleanup completed")

    async def receive_json(self, content):
        event_type = content.get('e')
        data = content.get('d')

        if event_type != 'HEARTBEAT':
            logger.info(f"[{self.__class__.__name__}] Received event: {event_type}")

        if event_type == 'HEARTBEAT':
            self.last_heartbeat = time.time()
            await self.send_json({"e": "HEARTBEAT_ACK"})
        elif event_type == 'IDENTIFY':
            await self.handle_identify(data)

    async def handle_identify(self, data):
        token = data.get('token')
        if not token:
            logger.warning(f"[{self.__class__.__name__}] Identify attempt without token")
            await self.close()
            return

        user_id = await get_user_id_from_token(token)
        if not user_id:
            logger.warning(f"[{self.__class__.__name__}] Invalid token in identify attempt")
            await self.close()
            return

        try:
            self.user = await sync_to_async(User.objects.get)(userID=user_id)
            
            # Check if user is subscribed to a tournament
            self.tournament = await sync_to_async(Tournament.objects.filter)(
                participants=self.user,
                status='PENDING'
            ).first()

            if not self.tournament:
                logger.warning(f"[{self.__class__.__name__}] User {self.user.userID} is not subscribed to any tournament")
                await self.close()
                return

            await self.channel_layer.group_add(
                f"tournament_{self.tournament.tournamentID}",
                self.channel_name
            )
            
            # Get safe profile for the user
            safe_profile = await sync_to_async(get_safe_profile)(self.user.__dict__, True)
            
            # Send TOURNAMENT_JOIN event with safe profile
            await self.send_json({
                "e": "TOURNAMENT_JOIN",
                "d": safe_profile
            })
            
            logger.info(f"[{self.__class__.__name__}] User identified and subscribed to tournament: {self.user.userID}")
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] User not found for ID: {user_id}")
            await self.close()

    async def heartbeat_check(self):
        while True:
            await asyncio.sleep(5)
            if time.time() - self.last_heartbeat > 5:
                logger.warning(f"[{self.__class__.__name__}] Heartbeat missed, closing connection")
                await self.close()
                break

    async def tournament_kick(self, event):
        kicked_user = event['user']
        if kicked_user['userID'] == self.user.userID:
            await self.send_json({
                "e": "TOURNAMENT_KICK",
                "d": {"message": "You have been kicked from the tournament"}
            })
            await self.close()
        else:
            await self.send_json({
                "e": "TOURNAMENT_KICK",
                "d": {"user": kicked_user}
            })

class MatchConsumer(AsyncJsonWebsocketConsumer):
    active_matches = {}

    async def connect(self):
        logger.info(f"[{self.__class__.__name__}] New connection attempt")
        await self.accept()
        await self.send_json({
            "e": "HELLO",
            "d": {"heartbeat_interval": 1000}
        })
        self.last_heartbeat = time.time()
        self.heartbeat_task = asyncio.create_task(self.heartbeat_check())
        self.match = None
        self.is_spectator = False
        logger.info(f"[{self.__class__.__name__}] Connection accepted, heartbeat check task started")

    async def disconnect(self, close_code):
        logger.info(f"[{self.__class__.__name__}] Disconnecting with close code: {close_code}")
        if hasattr(self, 'heartbeat_task'):
            self.heartbeat_task.cancel()

        if self.match and not self.is_spectator:
            await self.handle_player_quit()
        elif self.match and self.is_spectator:
            await self.leave_spectator_mode()

        logger.info(f"[{self.__class__.__name__}] Disconnected, cleanup completed")

    async def receive_json(self, content):
        event_type = content.get('e')
        data = content.get('d')

        if event_type != 'HEARTBEAT':
            pass

        if event_type == 'HEARTBEAT':
            self.last_heartbeat = time.time()
            await self.send_json({"e": "HEARTBEAT_ACK"})
        elif event_type == 'IDENTIFY':
            await self.handle_identify(data)
        elif event_type == 'MATCHMAKE_REQUEST':
            await self.handle_matchmake_request(data)
        elif event_type == 'MATCHMAKE_FORCE_JOIN':
            await self.handle_matchmake_force_join(data)
        elif event_type == 'PADDLE_MOVE':
            await self.handle_paddle_move(data)
        elif event_type == 'PLAYER_QUIT':
            await self.handle_player_quit()
        elif event_type == 'SPECTATE_REQUEST':
            await self.handle_spectate_request(data)

    async def heartbeat_check(self):
        while True:
            await asyncio.sleep(2)  # Check every 2 seconds
            current_time = time.time()
            if current_time - self.last_heartbeat > 10:  # No heartbeat for 10 seconds
                logger.warning(f"[{self.__class__.__name__}] User {self.user.userID} missed heartbeat too many times, closing connection")
                await self.close()
                break

    async def handle_identify(self, data):
        token = data.get('token')

        if token != os.getenv('BOT_TOKEN'):
            user_profile = await self.get_user_profile(token)
            if user_profile:
                self.user = await self.get_user_from_id(user_profile['userID'])
                await self.send_json({"e": "READY", "d": user_profile})
                logger.info(f"[{self.__class__.__name__}] User identified: {self.user.userID}")
            else:
                logger.warning(f"[{self.__class__.__name__}] Invalid token, closing connection")
                await self.close()
        else:
            self.user = await self.get_user_from_id('user_ai')
            user_data = UserSerializer(self.user).data
            safe_profile = get_safe_profile(user_data, me=True)
            safe_profile.pop('avatarID', None)
            await self.send_json({"e": "READY", "d": safe_profile})
            logger.info(f"[{self.__class__.__name__}] AI identified: {self.user.userID}")

    async def get_user_profile(self, token):
        try:
            user_id = await get_user_id_from_token(token)
            if user_id:
                try:
                    user = await sync_to_async(User.objects.get)(userID=user_id)
                    user_data = UserSerializer(user).data
                    safe_profile = await sync_to_async(get_safe_profile)(user_data, me=True)
                    logger.info(f"[{self.__class__.__name__}] User profile retrieved successfully")
                    return safe_profile
                except User.DoesNotExist:
                    logger.error(f"[{self.__class__.__name__}] User not found for ID: {user_id}")
            else:
                logger.error(f"[{self.__class__.__name__}] Failed to retrieve user ID from token")
        except Exception as e:
            logger.error(f"[{self.__class__.__name__}] Exception occurred while getting user ID from token: {str(e)}")
        return None

    async def handle_matchmake_request(self, data):
        match_type = data.get('match_type')
        logger.info(f"[{self.__class__.__name__}] Matchmaking request received for type: {match_type}")
        match = await self.find_or_create_match(match_type)
        self.match = match
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        # Initialize match state for this match
        if match.matchID not in self.active_matches:
            self.active_matches[match.matchID] = {
                'playerA': {'id': match.playerA['id'], 'paddle_y': 375, 'pos': 'A'},
                'playerB': {'id': match.playerB['id'] if match.playerB else None, 'paddle_y': 375, 'pos': 'B'},
                'ball': {},
                'scores': {match.playerA['id']: 0},
                'spectators': []
            }
            self.reset_ball(self.active_matches[match.matchID])
            logger.info(f"[{self.__class__.__name__}] New match state initialized for match: {match.matchID}")

        await self.send_json({
            "e": "MATCH_JOIN",
            "d": {
                "match_id": match.matchID,
                "side": "left" if match.playerA['id'] == self.user.userID else "right",
                "opponent": await self.get_opponent_info(match, self.user)
            }
        })
        if match.playerB:
            # Update playerB id in active match state
            self.active_matches[match.matchID]['playerB']['id'] = match.playerB['id']
            # Add playerB to active match game state scores
            self.active_matches[match.matchID]['scores'][match.playerB['id']] = 0
            # Send PLAYER_JOIN to playerA with playerB data
            playerB_info = await self.get_opponent_info(match, await self.get_user_from_id(match.playerA['id']))
            await self.channel_layer.group_send(
                f"match_{match.matchID}",
                {
                    "type": "player.join",
                    "player": playerB_info
                }
            )
            await self.send_match_ready(match)
            logger.info(f"[{self.__class__.__name__}] Match {match.matchID} started with both players")

    async def handle_matchmake_force_join(self, data):
        if self.user.userID != 'user_ai':
            logger.error(f"[{self.__class__.__name__}] User {self.user.userID} attempted to force join a match")
            return

        match_id = data.get('match_id')
        logger.info(f"[{self.__class__.__name__}] User {self.user.userID} asked to force join match {match_id}")

        match = await self.find_match_by_id(match_id)

        if not match:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} not found")
            await self.send_json({
                "e": "MATCH_FORCE_JOIN_FAILED",
                "d": {
                    "reason": "Match not found"
                }
            })
            return

        if match.flags != 2:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} is not an AI match")
            await self.send_json({
                "e": "MATCH_FORCE_JOIN_FAILED",
                "d": {
                    "reason": "Match is not an AI match"
                }
            })
            return

        match.playerB = {"id": self.user.userID, "platform": "server"}
        sync_to_async(match.save)()

        self.match = match
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        await self.send_json({
            "e": "MATCH_JOIN",
            "d": {
                "match_id": match.matchID,
                "side": "left" if match.playerA['id'] == self.user.userID else "right",
                "opponent": await self.get_opponent_info(match, self.user)
            }
        })
        if match.playerB:
            # Update playerB id in active match state
            self.active_matches[match.matchID]['playerB']['id'] = match.playerB['id']
            # Add playerB to active match game state scores
            self.active_matches[match.matchID]['scores'][match.playerB['id']] = 0
            # Send PLAYER_JOIN to playerA with playerB data
            playerB_info = await self.get_opponent_info(match, await self.get_user_from_id(match.playerA['id']))
            await self.channel_layer.group_send(
                f"match_{match.matchID}",
                {
                    "type": "player.join",
                    "player": playerB_info
                }
            )
            await self.send_match_ready(match)
            logger.info(f"[{self.__class__.__name__}] Match {match.matchID} started with both players")

    async def send_match_ready(self, match):
        match_state = self.active_matches[match.matchID]
        await self.channel_layer.group_send(
            f"match_{match.matchID}",
            {
                "type": "match.ready",
                "match_state": match_state
            }
        )
        logger.info(f"[{self.__class__.__name__}] MATCH_READY sent for match: {match.matchID}")
        asyncio.create_task(self.delayed_match_start(match))

    async def delayed_match_start(self, match):
        await asyncio.sleep(5)
        await self.start_match(match)

    async def match_ready(self, event):
        try:
            await self.send_json({
                "e": "MATCH_READY",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    async def handle_paddle_move(self, data):
        if self.is_spectator:
            return

        direction = data.get('direction')
        match_state = self.active_matches[self.match.matchID]
        player_key = 'playerA' if match_state['playerA']['id'] == self.user.userID else 'playerB'

        paddle_speed = 5  # Appropriate paddle speed (adjust as needed)

        if direction == 'up':
            match_state[player_key]['paddle_y'] = min(682, match_state[player_key]['paddle_y'] + paddle_speed)
        elif direction == 'down':
            match_state[player_key]['paddle_y'] = max(73, match_state[player_key]['paddle_y'] - paddle_speed)

        await self.send_match_update()

    async def handle_player_quit(self):
        if self.match is None:
            logger.info(f"[{self.__class__.__name__}] Player {self.user.userID} quit without being in a match")
            return

        logger.info(f"[{self.__class__.__name__}] Player {self.user.userID} quit the match {self.match.matchID}")

        if self.match.playerB is not None and self.match.playerA is not None:
            winner_id = self.match.playerA['id'] if self.match.playerB['id'] == self.user.userID else self.match.playerB['id']
            await self.send_match_end(winner_id)

        if self.match.playerB is None or self.match.playerA is None:
            if self.match.finishedAt is None:
                await self.delete_match(self.match.matchID)

            if self.match.matchID in self.active_matches:
                logger.info(f"[{self.__class__.__name__}] Deleting match state for match: {self.match.matchID}")
                del self.active_matches[self.match.matchID]

    async def handle_spectate_request(self, data):
        match_id = data.get('match_id')
        match = await self.find_match_by_id(match_id)

        if not match:
            logger.error(f"[{self.__class__.__name__}] Match {match_id} not found for spectating")
            await self.send_json({
                "e": "SPECTATE_FAILED",
                "d": {
                    "reason": "Match not found"
                }
            })
            return

        self.match = match
        self.is_spectator = True
        await self.channel_layer.group_add(
            f"match_{match.matchID}",
            self.channel_name
        )

        match_state = self.active_matches[match.matchID]
        match_state['spectators'].append(self.user.userID)

        await self.send_json({
            "e": "SPECTATE_JOIN",
            "d": {
                "match_id": match.matchID,
                "match_state": match_state
            }
        })

        logger.info(f"[{self.__class__.__name__}] User {self.user.userID} joined match {match_id} as spectator")

    async def leave_spectator_mode(self):
        if self.match and self.is_spectator:
            match_state = self.active_matches[self.match.matchID]
            match_state['spectators'].remove(self.user.userID)
            await self.channel_layer.group_discard(
                f"match_{self.match.matchID}",
                self.channel_name
            )
            logger.info(f"[{self.__class__.__name__}] User {self.user.userID} left spectator mode for match {self.match.matchID}")

    @database_sync_to_async
    def delete_match(self, match_id):
        try:
            match = Match.objects.get(matchID=match_id)
            match.delete()
            logger.info(f"[{self.__class__.__name__}] Deleted match {match_id} as playerB was None")
        except Match.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Failed to delete match {match_id}: Match not found")

    @database_sync_to_async
    def get_user_from_id(self, user_id):
        try:
            return User.objects.get(userID=user_id)
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] User not found: {user_id}")
            return None

    @database_sync_to_async
    def find_match_by_id(self, match_id):
        try:
            return Match.objects.get(matchID=match_id)
        except Match.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Match not found: {match_id}")
            return None

    @database_sync_to_async
    def find_or_create_match(self, match_type):
        if match_type == '1v1':
            available_match = Match.objects.filter(playerB__isnull=True, flags=0).first()
            if available_match and available_match.playerA['id'] != self.user.userID:
                available_match.playerB = {"id": self.user.userID, "platform": "web"}
                available_match.save()
                logger.info(f"[{self.__class__.__name__}] Joined existing match: {available_match.matchID}")
                return available_match
            else:
                new_match = Match.objects.create(
                    matchID=generate_id("match"),
                    playerA={"id": self.user.userID, "platform": "web"},
                    winnerID=None,
                    scores={},
                    finishedAt=None,
                    flags=0
                )
                logger.info(f"[{self.__class__.__name__}] Created new match: {new_match.matchID}")
                return new_match
        elif match_type == 'ai':
            new_match = Match.objects.create(
                matchID=generate_id("match"),
                playerA={"id": self.user.userID, "platform": "web"},
                winnerID=None,
                finishedAt=None,
                scores={},
                flags=1 << 1  # AI flag
            )
            logger.info(f"[{self.__class__.__name__}] Created new AI match: {new_match.matchID}")
            try:
                httpx.post('https://pongbot:5443/bot/connect', json={'matchID': new_match.matchID}, verify=False)
            except Exception as e:
                logger.error(f"[{self.__class__.__name__}] Failed to connect to bot: {str(e)}")
            return new_match

    @database_sync_to_async
    def get_opponent_info(self, match, user):
        if match.playerB is None:
            return None
        opponent_id = match.playerB['id'] if match.playerA['id'] == user.userID else match.playerA['id']
        try:
            opponent = User.objects.get(userID=opponent_id)
            opponent_data = UserSerializer(opponent).data
            safe_profile = get_safe_profile(opponent_data, me=False)
            opponent_settings, _ = UserSettings.objects.get_or_create(userID=opponent_id)
            opponent_settings_data = UserSettingsSerializer(opponent_settings).data
            safe_profile['paddle_skin'] = opponent_settings_data['selectedPaddleSkin']
            logger.info(f"[{self.__class__.__name__}] Opponent info retrieved for: {opponent_id}")
            return safe_profile
        except User.DoesNotExist:
            logger.error(f"[{self.__class__.__name__}] Opponent not found: {opponent_id}")
            return None

    async def send_match_update(self):
        match_state = self.active_matches[self.match.matchID]
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "match.update",
                "match_state": match_state
            }
        )

    async def match_update(self, event):
        try:
            await self.send_json({
                "e": "MATCH_UPDATE",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    async def match_begin(self, event):
        try:
            await self.send_json({
                "e": "MATCH_BEGIN",
                "d": event["match_state"]
            })
        except Exception as _:
            pass

    @database_sync_to_async
    def start_match(self, match):
        # Use async_to_sync to run the coroutine in a new event loop
        async_to_sync(self._start_match_async)(match.matchID)
        logger.info(f"[{self.__class__.__name__}] Match loop started for match: {match.matchID}")

    async def _start_match_async(self, match_id):
        await self.channel_layer.group_send(
            f"match_{match_id}",
            {
                "type": "match.begin",
                "match_state": self.active_matches[match_id]
            }
        )
        asyncio.create_task(self.run_match_loop(match_id))

    async def run_match_loop(self, match_id):
        TERRAIN_WIDTH = 1200
        TERRAIN_HEIGHT = 750
        PADDLE_WIDTH = 10
        PADDLE_HEIGHT = 60 # Paddle height is actually 120 but we're using half of it
        BALL_RADIUS = 25 / 2
        BALL_SPEED = 0.6
        BALL_MAX_SPEED = 17
        MAX_SCORE = 10
        REFRESH_RATE = 1 / 60

        while match_id in self.active_matches:
            match_state = self.active_matches[match_id]

            # Update ball position
            match_state['ball']['x'] += match_state['ball']['dx'] * BALL_SPEED
            match_state['ball']['y'] += match_state['ball']['dy'] * BALL_SPEED

            # Check for collisions with top and bottom walls
            if match_state['ball']['y'] - BALL_RADIUS <= 0 or match_state['ball']['y'] + BALL_RADIUS >= TERRAIN_HEIGHT:
                match_state['ball']['dy'] *= -1

            # Check for collisions with paddles
            if (match_state['ball']['x'] - BALL_RADIUS <= PADDLE_WIDTH and  # Left side of ball hits Player A's paddle
                match_state['ball']['y'] - BALL_RADIUS <= match_state['playerA']['paddle_y'] + PADDLE_HEIGHT and  # Ball's bottom is above paddle's bottom
                match_state['ball']['y'] + BALL_RADIUS >= match_state['playerA']['paddle_y'] - PADDLE_HEIGHT):  # Ball's top is below paddle's top
                match_state['ball']['dx'] *= -1
                if abs(match_state['ball']['dx']) < BALL_MAX_SPEED:
                    match_state['ball']['dx'] *= 1.1
                if abs(match_state['ball']['dy']) < BALL_MAX_SPEED:
                    match_state['ball']['dy'] *= 1.1
                match_state['ball']['x'] = PADDLE_WIDTH + BALL_RADIUS
                await self.send_paddle_hit(match_state['playerA'], match_state['ball'])

            elif (match_state['ball']['x'] + BALL_RADIUS >= TERRAIN_WIDTH - PADDLE_WIDTH and  # Right side of ball hits Player B's paddle
                match_state['ball']['y'] - BALL_RADIUS <= match_state['playerB']['paddle_y'] + PADDLE_HEIGHT and  # Ball's bottom is above paddle's bottom
                match_state['ball']['y'] + BALL_RADIUS >= match_state['playerB']['paddle_y'] - PADDLE_HEIGHT):  # Ball's top is below paddle's top
                match_state['ball']['dx'] *= -1
                if abs(match_state['ball']['dx']) < BALL_MAX_SPEED:
                    match_state['ball']['dx'] *= 1.1
                if abs(match_state['ball']['dy']) < BALL_MAX_SPEED:
                    match_state['ball']['dy'] *= 1.1
                match_state['ball']['x'] = TERRAIN_WIDTH - PADDLE_WIDTH - BALL_RADIUS
                await self.send_paddle_hit(match_state['playerB'], match_state['ball'])

            # Check for scoring
            if match_state['ball']['x'] <= 0:
                match_state['scores'][match_state['playerB']['id']] += 1
                self.reset_ball(match_state)
                await self.send_ball_scored(match_state['playerB'])
            elif match_state['ball']['x'] + BALL_RADIUS >= TERRAIN_WIDTH:
                match_state['scores'][match_state['playerA']['id']] += 1
                self.reset_ball(match_state)
                await self.send_ball_scored(match_state['playerA'])

            # Check if game has ended
            if match_state['scores'][match_state['playerA']['id']] >= MAX_SCORE or match_state['scores'][match_state['playerB']['id']] >= MAX_SCORE:
                winner_id = match_state['playerA']['id'] if match_state['scores'][match_state['playerA']['id']] >= MAX_SCORE else match_state['playerB']['id']
                await self.send_match_update()
                await self.send_match_end(winner_id)
                break

            await self.send_match_update()
            await asyncio.sleep(REFRESH_RATE)

    async def send_paddle_hit(self, player, ball):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "paddle.hit",
                "player": player,
                "ball": ball
            }
        )

    async def paddle_hit(self, event):
        try:
            await self.send_json({
                "e": "PADDLE_HIT",
                "d": {"player": event["player"], "ball": event["ball"]}
            })
            logger.info(f"[{self.__class__.__name__}] Paddle hit event sent for player: {event['player']['id']}")
        except Exception as _:
            pass

    async def send_ball_scored(self, player):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "ball.scored",
                "player": player
            }
        )

    async def ball_scored(self, event):
        try:
            await self.send_json({
                "e": "BALL_SCORED",
                "d": {"player": event["player"]}
            })
            logger.info(f"[{self.__class__.__name__}] Ball scored event processed for player: {event['player']['id']}")
        except Exception as _:
            pass

    def reset_ball(self, match_state):
        if self.match.flags & (1 << 1):
            dx = random.choice([-8, -7])
        else:
            dx = random.choice([-8, -7, 7, 8])  # Increased ball speed slightly
        dy = random.choice([-8, -7, 7 , 8])
        match_state['ball'] = {'x': 600, 'y': 375, 'dx': dx, 'dy': dy}

    async def end_match(self, match_id, winner_id):
        if self.match:
            # Match already ended
            if self.match.winnerID is not None or self.match.finishedAt is not None:
                return None

            self.match.winnerID = winner_id
            self.match.finishedAt = timezone.now()
            self.match.scores = self.active_matches[match_id]['scores']
            await self.save_match()

            if self.match.matchID in self.active_matches:
                logger.info(f"[{self.__class__.__name__}] Deleting match state for match: {self.match.matchID}")
                del self.active_matches[self.match.matchID]

            logger.info(f"[{self.__class__.__name__}] Match {match_id} ended. Winner: {winner_id}")

            try:
                loop = asyncio.get_event_loop()
                user = await loop.run_in_executor(None, lambda: User.objects.get(userID=winner_id))
                user.xp += random.randint(15, 25)
                user.money += random.randint(5, 10)
                await loop.run_in_executor(None, user.save)
            except User.DoesNotExist:
                logger.error(f"[{self.__class__.__name__}] Cannot give {winner_id} xp, user not found")

            return {
                "type": "match.ended",
                "winner": winner_id
            }

    async def save_match(self):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.match.save)

    async def send_match_end(self, winner_id):
        try:
            end_match_data = await self.end_match(self.match.matchID, winner_id)
            await self.channel_layer.group_send(
                f"match_{self.match.matchID}",
                end_match_data
            )
            logger.info(f"[{self.__class__.__name__}] Match end event sent for match: {self.match.matchID}")
        except Exception as _:
            pass

    async def match_ended(self, event):
        if self.is_spectator:
            await self.send_json({
                "e": "MATCH_END",
                "d": {"winner": event["winner"]}
            })
        else:
            try:
                await self.send_json({
                        "e": "MATCH_END",
                        "d": {"won": event["winner"] == self.user.userID}
                    })
                logger.info(f"[{self.__class__.__name__}] Match end event processed for user: {self.user.userID}")
                await self.close()
            except Exception as _:
                pass

    async def player_join(self, event):
        player_data = event["player"]

        if player_data['userID'] == self.user.userID:
            return

        self.match.playerB = {"id": player_data['userID'], "platform": ("web" if player_data['userID'] != 'user_ai' else "server")}

        try:
            await self.send_json({
                "e": "PLAYER_JOIN",
                "d": player_data
            })
            logger.info(f"[{self.__class__.__name__}] Player join event sent for match: {self.match.matchID}")
        except Exception as _:
            pass
