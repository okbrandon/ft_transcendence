import logging
import urllib.parse
import requests
import httpx

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Conversation, User, Relationship
from asgiref.sync import sync_to_async
from django.db.models import Q

logger = logging.getLogger(__name__)

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

		logger.info(f"User {user.username} connected")
		#await self.ensure_conversations_exist(user)
		await self.accept()

	async def disconnect(self, close_code):
		logger.info("Disconnected")

	async def receive(self, text_data):
		pass

	async def get_user_from_token(self, token):
		try:
			url = "http://localhost:8000/api/v1/users/@me/profile"
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
	
	@sync_to_async
	def ensure_conversations_exist(self, user):
		friends = Relationship.objects.filter(
			Q(userA=user.user_id, status=1) | Q(userB=user.user_id, status=1)
		)
		
		for relationship in friends:
			friend_id = relationship.userA if relationship.userA != user.user_id else relationship.userB
	
			try:
				friend = User.objects.get(userID=friend_id)
			except User.DoesNotExist:
				continue
	
			existing_conversation = Conversation.objects.filter(
				participants__in=[user, friend], type='private_message'
			).exists()
			
			if not existing_conversation:
				new_conversation = Conversation.objects.create(type='private_message')
				new_conversation.participants.add(user, friend)
				new_conversation.save()