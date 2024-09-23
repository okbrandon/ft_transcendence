import logging
import urllib.parse
import httpx
import json
import asyncio
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from asgiref.sync import sync_to_async

from django.db.models import Q, Count
from django.utils import timezone

from .models import Conversation, User, Relationship, Match, GameToken
from .util import generate_id

logger = logging.getLogger(__name__)
connected_users = {}

class SocketUser:
    def __init__(self, user_id, username):
        self.user_id = user_id
        self.username = username

class StatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = None
        self.heartbeat_task = None
        self.failed_heartbeats = 0

        query_string = self.scope['query_string'].decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token is None:
            logger.info("[StatusConsummer] Connection attempt without token")
            await self.close()
            return

        userID = await self.get_userID_from_token(token)

        if userID is None:
            logger.info("[StatusConsummer] Connection attempt with invalid token")
            await self.close()
            return

        try:
            self.user = await sync_to_async(User.objects.get)(userID=userID)
        except User.DoesNotExist:
            logger.info(f"[StatusConsummer] User {userID} not found")
            await self.close()
            return

        await self.accept()
        self.heartbeat_task = asyncio.create_task(self.check_heartbeat())
        logger.info(f"[StatusConsummer] User {self.user.username} connected")

    async def disconnect(self, close_code):
        if self.heartbeat_task and not self.heartbeat_task.done():
            self.heartbeat_task.cancel()
        if self.user is not None:
            await self.update_user_status(False, None)
            logger.info(f"[StatusConsummer] User {self.user.username} disconnected")

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
                    if activity not in ["HOME", "QUEUEING", "PLAYING_VS_AI", "PLAYING_MULTIPLAYER"]:
                        raise Exception("Invalid activity, not in [HOME, QUEUEING, PLAYING_VS_AI, PLAYING_MULTIPLAYER]")

                    self.failed_heartbeats = 0
                    await self.update_user_status(True, activity)

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
        self.user.status = {
            "online": online,
            "activity": activity,
            "last_seen": timezone.now().isoformat()
        }
        self.user.save()

    async def check_heartbeat(self):
        while True:
            await asyncio.sleep(4)
            self.failed_heartbeats += 1

            if self.failed_heartbeats >= 3:
                logger.info(f"[StatusConsummer] User {self.user.username} missed 3 heartbeats, closing connection")
                await self.close()
                break

            await self.send(json.dumps({
                "type": "heartbeat"
            }))

    async def get_userID_from_token(self, token):
        try:
            url = "http://backend:8000/api/v1/users/@me/profile"
            headers = {
                "Authorization": f"Bearer {token}"
            }

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            if response.status_code != 200:
                raise Exception(f"Failed to get user info: {response.status_code} {response.reason}")

            user_data = response.json()
            return user_data["userID"]

        except Exception as err:
            logger.error(f"An error occurred getting the user from token: {err}")
            return None

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = urllib.parse.parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if token is None:
            logger.info("Chat connection attempt without token")
            await self.close()
            return

        user = await self.get_user_from_token(token)

        if user is None:
            logger.info("Chat connection attempt with invalid token")
            await self.close()
            return

        connected_users[self] = user

        logger.info(f"User {user.username} connected")
        await self.ensure_conversations_exist(user)
        logger.info(f"User {user.username} conversations ensured")
        await self.accept()

    async def disconnect(self, close_code):
        user = connected_users.get(self, None)

        if user is not None:
            logger.info(f"User {user.username} disconnected")
            del connected_users[self]

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
                    user = connected_users.get(self, None)

                    if user is None:
                        raise Exception("Something went wrong when receiving the message")
                    if conversation_id is None:
                        raise Exception("Missing conversation ID")
                    if content is None:
                        raise Exception("Missing content")

                    logger.info(f"Received message from {user.username}: {json_data}")
                    await self.add_message_to_conversation(conversation_id, user, content)
                    await self.notify_new_message(conversation_id, user.username, content)

                case _:
                    raise Exception(f"Invalid message type: {message_type}")
        except Exception as err:
            await self.send(json.dumps({
                "type": "error",
                "message": "Invalid JSON",
                "more_info": str(err)
            }))

    async def get_user_from_token(self, token):
        try:
            url = "http://backend:8000/api/v1/users/@me/profile"
            headers = {
                "Authorization": f"Bearer {token}"
            }

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)

            if response.status_code != 200:
                raise Exception(f"Failed to get user info: {response.status_code} {response.reason}")

            user_data = response.json()
            user = SocketUser(user_id=user_data["userID"], username=user_data["username"])
            return user

        except Exception as err:
            logger.error(f"An error occurred getting the user from token: {err}")
            return None

    async def notify_new_message(self, conversationID, senderUsername, message):
        conversation = await sync_to_async(Conversation.objects.get)(conversationID=conversationID)

        if not conversation:
            raise Exception(f"Conversation {conversationID} not found")

        participants = await sync_to_async(list)(conversation.participants.all())

        for participant in participants:
            connected_user = {consumer for consumer, user in connected_users.items() if user.user_id == participant.userID}

            if connected_user:
                await connected_user.pop().send(json.dumps({
                    "type": "conversation_update",
                    "senderUsername": senderUsername,
                    "messagePreview": message[:32] + "..." if len(message) > 32 else message
                }))

    @sync_to_async
    def add_message_to_conversation(self, conversation_id, socketUser, content):
        conversation = Conversation.objects.get(conversationID=conversation_id)

        if not conversation:
            raise Exception(f"Conversation {conversation_id} not found")

        try:
            user = User.objects.get(userID=socketUser.user_id)
        except User.DoesNotExist:
            return

        if user not in conversation.participants.all():
            raise Exception(f"User {user.username} is not part of conversation {conversation_id}")

        conversation.messages.create(messageID=generate_id("msg"), sender=user, content=content)
        conversation.save()

    @sync_to_async
    def ensure_conversations_exist(self, socketUser):
        friends = Relationship.objects.filter(
            Q(userA=socketUser.user_id) | Q(userB=socketUser.user_id)
        )
        friends = friends.exclude(
            Q(status=2) & (Q(userA=socketUser.user_id) | Q(userB=socketUser.user_id))
        )

        user = User.objects.get(userID=socketUser.user_id)

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != socketUser.user_id else relationship.userB

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

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_token = self.scope['url_route']['kwargs']['game_token']
        self.match = None
        self.user = None
        self.heartbeat_interval = 3  # seconds
        self.missed_heartbeats = 0
        self.game_state = None
        self.game_loop_task = None
        self.heartbeat_task = None

        if await self.validate_game_token():
            await self.accept()
            await self.send_json({
                "e": "HEARTBEAT_INTERVAL",
                "d": {"interval": self.heartbeat_interval}
            })
            self.heartbeat_task = asyncio.create_task(self.check_heartbeat())
            await self.join_match()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
        if self.game_loop_task:
            self.game_loop_task.cancel()
        if self.match:
            await self.leave_match()

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('e')

        if event == 'HEARTBEAT':
            await self.send_json({"e": "HEARTBEAT_ACK"})
            self.missed_heartbeats = 0
        elif event == 'PADDLE_UP':
            await self.handle_paddle_move('up')
        elif event == 'PADDLE_DOWN':
            await self.handle_paddle_move('down')

    async def check_heartbeat(self):
        while True:
            await asyncio.sleep(self.heartbeat_interval)
            self.missed_heartbeats += 1
            if self.missed_heartbeats >= 3:
                logger.info(f"User {self.user.username} missed 3 heartbeats, closing connection")
                await self.leave_match()
                await self.close(code=4000)  # Use a custom close code
                break

    @database_sync_to_async
    def get_player_side(self):
        if self.match.playerA['id'] == self.user.userID:
            return 'left'
        elif self.match.playerB['id'] == self.user.userID:
            return 'right'
        else:
            return None


    @database_sync_to_async
    def validate_game_token(self):
        try:
            game_token = GameToken.objects.get(token=self.game_token)
            self.match = Match.objects.get(matchID=game_token.matchID)
            self.user = User.objects.get(userID=game_token.userID)
            return True
        except (GameToken.DoesNotExist, Match.DoesNotExist, User.DoesNotExist):
            return False

    async def join_match(self):
        await self.channel_layer.group_add(
            f"match_{self.match.matchID}",
            self.channel_name
        )

        player_side = await self.get_player_side()

        await self.send_json({
            "e": "PLAYER_SIDE",
            "d": {"side": player_side}
        })

        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "player_join",
                "user": await self.get_user_profile()
            }
        )

        if await self.both_players_joined():
            await self.start_game()


    async def leave_match(self):
        if self.match:
            opponent = await self.get_opponent()
            if opponent:
                await self.update_match_winner(opponent)
                await self.channel_layer.group_send(
                    f"match_{self.match.matchID}",
                    {
                        "type": "player_leave",
                        "user": await self.get_user_profile()
                    }
                )
            await self.channel_layer.group_discard(
                f"match_{self.match.matchID}",
                self.channel_name
            )

    @database_sync_to_async
    def both_players_joined(self):
        return self.match.playerA and self.match.playerB

    @database_sync_to_async
    def get_opponent(self):
        if self.match.playerA['id'] == self.user.userID:
            return User.objects.get(userID=self.match.playerB['id'])
        else:
            return User.objects.get(userID=self.match.playerA['id'])

    @database_sync_to_async
    def update_match_winner(self, winner):
        self.match.winnerID = winner.userID
        self.match.finishedAt = timezone.now()
        self.match.save()

    async def start_game(self):
        self.game_state = {
            'ball': {'x': 400, 'y': 300, 'dx': random.choice([-5, 5]), 'dy': random.choice([-5, 5])},
            'paddles': {self.match.playerA['id']: 250, self.match.playerB['id']: 250},
            'scores': {self.match.playerA['id']: 0, self.match.playerB['id']: 0}
        }
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {"type": "game_start_sequence"}
        )
        await asyncio.sleep(3)  # Wait for 3 seconds before starting the game
        self.game_loop_task = asyncio.create_task(self.game_loop())
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "game_begin",
                "game_state": self.game_state
            }
        )

    async def game_loop(self):
        while True:
            await asyncio.sleep(0.033)  # ~30 fps
            self.update_game_state()
            await self.send_game_update()

    def update_game_state(self):
        ball = self.game_state['ball']
        paddles = self.game_state['paddles']
        scores = self.game_state['scores']

        # Move ball
        ball['x'] += ball['dx']
        ball['y'] += ball['dy']

        # Check for collisions with top and bottom walls
        if ball['y'] <= 0 or ball['y'] >= 600:
            ball['dy'] *= -1

        # Check for collisions with paddles
        if (ball['x'] <= 20 and paddles[self.match.playerA['id']] <= ball['y'] <= paddles[self.match.playerA['id']] + 100) or \
           (ball['x'] >= 780 and paddles[self.match.playerB['id']] <= ball['y'] <= paddles[self.match.playerB['id']] + 100):
            ball['dx'] *= -1
            asyncio.create_task(self.send_paddle_hit_event(self.match.playerA['id']))
        elif (ball['x'] >= 780 and paddles[self.match.playerB['id']] <= ball['y'] <= paddles[self.match.playerB['id']] + 100):
            ball['dx'] *= -1
            asyncio.create_task(self.send_paddle_hit_event(self.match.playerB['id']))

        # Check for scoring
        if ball['x'] <= 0:
            scores[self.match.playerB['id']] += 1
            self.reset_ball()
            asyncio.create_task(self.player_scored(self.match.playerB['id']))
        elif ball['x'] >= 800:
            scores[self.match.playerA['id']] += 1
            self.reset_ball()
            asyncio.create_task(self.player_scored(self.match.playerA['id']))

        # Check for game end
        if scores[self.match.playerA['id']] >= 11 or scores[self.match.playerB['id']] >= 11:
            asyncio.create_task(self.end_game())

    def reset_ball(self):
        self.game_state['ball'] = {'x': 400, 'y': 300, 'dx': random.choice([-5, 5]), 'dy': random.choice([-5, 5])}

    async def send_game_update(self):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "game_update",
                "game_state": self.game_state
            }
        )

    async def handle_paddle_move(self, direction):
        if self.match and self.match.startedAt and not self.match.finishedAt:
            paddle_pos = self.game_state['paddles'][self.user.userID]
            if direction == 'up' and paddle_pos > 0:
                self.game_state['paddles'][self.user.userID] -= 10
            elif direction == 'down' and paddle_pos < 500:
                self.game_state['paddles'][self.user.userID] += 10

    async def player_scored(self, scorer_id):
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "player_scored_event",
                "scorer": await self.get_user_profile(scorer_id),
                "scores": self.game_state['scores']
            }
        )

    async def end_game(self):
        winner_id = max(self.game_state['scores'], key=self.game_state['scores'].get)
        winner = await self.get_user_profile(winner_id)
        await self.update_match_winner(winner)
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "game_ended",
                "winner": winner,
                "scores": self.game_state['scores']
            }
        )
        self.game_loop_task.cancel()

    @database_sync_to_async
    def get_user_profile(self, user_id=None):
        user = User.objects.get(userID=user_id or self.user.userID)
        return {
            "id": user.userID,
            "username": user.username,
            # Add other relevant user data
        }

    async def player_join(self, event):
        await self.send_json({
            "e": "PLAYER_JOIN",
            "d": event['user']
        })

    async def player_leave(self, event):
        await self.send_json({
            "e": "PLAYER_LEAVE",
            "d": event['user']
        })

    async def game_start_sequence(self, event):
        await self.send_json({
            "e": "GAME_START_SEQUENCE",
            "d": {}
        })

    async def game_begin(self, event):
        await self.send_json({
            "e": "GAME_BEGIN",
            "d": event['game_state']
        })

    async def game_update(self, event):
        await self.send_json({
            "e": "GAME_UPDATE",
            "d": event['game_state']
        })

    async def player_scored_event(self, event):
        await self.send_json({
            "e": "PLAYER_SCORED",
            "d": {
                "user": event['scorer'],
                "scores": event['scores']
            }
        })

    async def send_paddle_hit_event(self, player_id):
        # Get the current game state
        game_state = self.match.get_game_state()  # Assuming there's a method to get the game state

        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "paddle_hit",
                "player_id": player_id,
                "game_update": {
                    "score": game_state.score,
                    "ball_position": game_state.ball_position,
                    "paddle_positions": game_state.paddle_positions,
                    # Add any other relevant game state information
                }
            }
        )



    async def game_ended(self, event):
        await self.send_json({
            "e": "GAME_ENDED",
            "d": {
                "winner": event['winner'],
                "scores": event['scores']
            }
        })

    async def send_json(self, content):
        await self.send(text_data=json.dumps(content))
