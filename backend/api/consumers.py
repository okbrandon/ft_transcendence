import logging
import urllib.parse
import requests

from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)

class User:
	def __init__(self, user_id, username):
		self.user_id = id
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

			response = requests.get(url, headers=headers)
			if response.status_code != 200:
				raise Exception(f"Failed to get user info: {response.status_code} {response.reason}")

			user_data = response.json()
			user = User(user_id=user_data["userID"], username=user_data["username"])
			return user
		except Exception as err:
			logger.error(f"An error occurred getting the user from token: {err}")
			return None