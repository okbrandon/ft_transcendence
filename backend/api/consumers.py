import logging
import urllib.parse
import httpx
import json
import asyncio
import random
import os

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from asgiref.sync import sync_to_async

from django.db.models import Q, Count
from django.utils import timezone

from .models import Conversation, User, Relationship, Match, GameToken
from .util import generate_id, get_user_id_from_token, get_safe_profile
from .serializers import UserSerializer

logger = logging.getLogger(__name__)

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
                    if activity not in ["HOME", "QUEUEING", "PLAYING_VS_AI", "PLAYING_MULTIPLAYER"]:
                        raise Exception("Invalid activity, not in [HOME, QUEUEING, PLAYING_VS_AI, PLAYING_MULTIPLAYER]")

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
            Q(status=2) & (Q(userA=user.userID) | Q(userB=user.userID))
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

        # Load configuration from environment variables
        self.terrain_width = int(os.getenv('PONG_TERRAIN_WIDTH', 1200))
        self.terrain_height = int(os.getenv('PONG_TERRAIN_HEIGHT', 750))
        self.paddle_width = int(os.getenv('PONG_PADDLE_WIDTH', 10))
        self.paddle_height = int(os.getenv('PONG_PADDLE_HEIGHT', 100))
        self.paddle_offset = int(os.getenv('PONG_PADDLE_OFFSET', 20))

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
            await self.handle_player_leave()

    async def handle_player_leave(self):
        opponent = await self.get_opponent()
        player_side = await self.get_player_side()
        
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "player_leave",
                "user": await self.get_user_profile(),
                "side": player_side
            }
        )

        if opponent:
            await self.update_match_winner(opponent)
        else:
            await self.destroy_match()

        await self.channel_layer.group_discard(
            f"match_{self.match.matchID}",
            self.channel_name
        )


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
                logger.info(f"[{self.__class__.__name__}] User {self.user.username} missed 3 heartbeats, closing connection")
                await self.handle_player_leave()
                await self.close(code=4000)  # Use a custom close code
                break

    @database_sync_to_async
    def destroy_match(self):
        self.match.delete()
        logger.info(f"Match {self.match.matchID} destroyed as it became empty")

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

        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {
                "type": "player_join",
                "user": await self.get_user_profile(),
                "side": player_side
            }
        )

        # If this is the second player to join, send the first player's join event to this player
        if player_side == 'right':
            first_player = await self.get_user_profile(self.match.playerA['id'])
            await self.send_json({
                "e": "PLAYER_JOIN",
                "d": {
                    "user": first_player,
                    "side": "left"
                }
            })

        if await self.both_players_joined():
            await self.start_game()


    async def leave_match(self):
        if self.match:
            opponent = await self.get_opponent()
            player_side = await self.get_player_side()
            if opponent:
                await self.update_match_winner(opponent)
                await self.channel_layer.group_send(
                    f"match_{self.match.matchID}",
                    {
                        "type": "player_leave",
                        "user": await self.get_user_profile(),
                        "side": player_side
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
            'ball': {'x': self.terrain_width // 2, 'y': self.terrain_height // 2, 'dx': random.choice([-5, 5]), 'dy': random.choice([-5, 5])},
            'paddles': {self.match.playerA['id']: self.terrain_height // 2 - self.paddle_height // 2,
                        self.match.playerB['id']: self.terrain_height // 2 - self.paddle_height // 2},
            'scores': {self.match.playerA['id']: 0, self.match.playerB['id']: 0}
        }
        await self.channel_layer.group_send(
            f"match_{self.match.matchID}",
            {"type": "game_start_sequence"}
        )
        await asyncio.sleep(16)  # Wait for 3 seconds before starting the game
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
        if ball['y'] <= 0 or ball['y'] >= self.terrain_height:
            ball['dy'] *= -1

        # Check for collisions with paddles
        if (ball['x'] <= self.paddle_offset + self.paddle_width and
            paddles[self.match.playerA['id']] <= ball['y'] <= paddles[self.match.playerA['id']] + self.paddle_height) or \
           (ball['x'] >= self.terrain_width - self.paddle_offset - self.paddle_width and
            paddles[self.match.playerB['id']] <= ball['y'] <= paddles[self.match.playerB['id']] + self.paddle_height):
            ball['dx'] *= -1
            asyncio.create_task(self.send_paddle_hit_event(self.match.playerA['id']))
        elif (ball['x'] >= self.terrain_width - self.paddle_offset - self.paddle_width and
              paddles[self.match.playerB['id']] <= ball['y'] <= paddles[self.match.playerB['id']] + self.paddle_height):
            ball['dx'] *= -1
            asyncio.create_task(self.send_paddle_hit_event(self.match.playerB['id']))

        # Check for scoring
        if ball['x'] <= 0:
            scores[self.match.playerB['id']] += 1
            self.reset_ball()
            asyncio.create_task(self.player_scored(self.match.playerB['id']))
        elif ball['x'] >= self.terrain_width:
            scores[self.match.playerA['id']] += 1
            self.reset_ball()
            asyncio.create_task(self.player_scored(self.match.playerA['id']))

        # Check for game end
        if scores[self.match.playerA['id']] >= 11 or scores[self.match.playerB['id']] >= 11:
            asyncio.create_task(self.end_game())

    def reset_ball(self):
        self.game_state['ball'] = {'x': self.terrain_width // 2, 'y': self.terrain_height // 2,
                                   'dx': random.choice([-5, 5]), 'dy': random.choice([-5, 5])}

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
            elif direction == 'down' and paddle_pos < self.terrain_height - self.paddle_height:
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
            "avatarID": user.avatarID
        }

    async def player_join(self, event):
        await self.send_json({
            "e": "PLAYER_JOIN",
            "d": {
                "user": event['user'],
                "side": event['side']
            }
    })

    async def player_leave(self, event):
        await self.send_json({
            "e": "PLAYER_LEAVE",
            "d": {
                "user": event['user'],
                "side": event['side']
            }
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
