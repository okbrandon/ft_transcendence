import logging
import urllib.parse
import requests
import httpx
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db.models import Q, Count

from .models import Conversation, User, Relationship
from .util import generate_id

logger = logging.getLogger(__name__)
connected_users = {}

class SocketUser:
	def __init__(self, user_id, username):
		self.user_id = user_id
		self.username = username

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
			url = "http://backend/api/v1/users/@me/profile"
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
				new_conversation.participants.add(user, friend)
				new_conversation.save()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
        else:
            await self.accept()
            self.match = None
            self.player = None

    async def disconnect(self, close_code):
        if self.match:
            await self.leave_match()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'join_queue':
            await self.join_queue()
        elif action == 'move':
            await self.handle_move(data.get('direction'))

    async def join_queue(self):
        # create a new match if there's no ongoing match
        if not self.match:
            self.match = Match.objects.create(
                matchID=generate_id('match'),
                playerA=self.user,
                scores={str(self.user.userID): 0}
            )
            self.player = 'A'
            await self.channel_layer.group_add(
                f'match_{self.match.matchID}',
                self.channel_name
            )
            await self.send(json.dumps({
                'action': 'match_found',
                'matchID': self.match.matchID,
                'player': self.player
            }))
        else:
            await self.send(json.dumps({
                'action': 'error',
                'message': 'Already in a match'
            }))

    async def handle_move(self, direction):
        if not self.match:
            return

        # Update paddle position
        if self.player == 'A':
            self.match.playerA_paddle = min(max(self.match.playerA_paddle + (10 if direction == 'down' else -10), 0), 500)
        else:
            self.match.playerB_paddle = min(max(self.match.playerB_paddle + (10 if direction == 'down' else -10), 0), 500)

        self.match.save()

        # Broadcast updated game state
        await self.channel_layer.group_send(
            self.match.matchID,
            {
                'type': 'game_update',
                'game_state': self.get_game_state()
            }
        )

    async def game_update(self, event):
        await self.send(json.dumps(event['game_state']))

    def get_game_state(self):
        return {
            'action': 'game_update',
            'paddle1Y': self.match.playerA_paddle,
            'paddle2Y': self.match.playerB_paddle,
            'ballX': self.match.ball_x,
            'ballY': self.match.ball_y,
            'scores': self.match.scores
        }

    async def leave_match(self):
        if self.match:
            await self.channel_layer.group_discard(
                self.match.matchID,
                self.channel_name
            )
            self.match = None
            self.player = None