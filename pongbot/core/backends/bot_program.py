import asyncio
import websockets
import logging
import ssl
import json
import os

from multiprocessing import Process

from .config import get_config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BotProgram:

	def __init__(self, **kwargs) -> None:
		self.ws_connection = None
		self.heartbeat_task = None
		self.heartbeat_interval = None
		self.heartbeat_ack = 0

		self.is_identified = False

		self.host = kwargs.get('host', None)
		self.port = kwargs.get('port', None)
		self.match_id = kwargs.get('matchID', None)
		self.ws_url = get_config()['ws_url'].format(self.host, self.port)

		if not self.host or not self.port or not self.match_id:
			raise ValueError("Invalid host, port or match ID")

		# Create SSL context for secure connection
		self.ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
		self.ssl_context.load_cert_chain(certfile='/certs/server.crt', keyfile='/certs/server.key')
		self.ssl_context.check_hostname = False # Ignoring hostname verification for now
		self.ssl_context.verify_mode = ssl.CERT_NONE

		self.listen_process = Process(target=self.run_listen)
		self.listen_process.start()

	async def heartbeat(self):
		while True:
			if self.ws_connection:
				await self.ws_connection.send(json.dumps({'e': 'HEARTBEAT'}))
			if self.heartbeat_ack == 1:
				await self.handle_identify()
			if self.heartbeat_ack == 2 and self.is_identified:
				await self.handle_join_match()
			await asyncio.sleep(self.heartbeat_interval / 1000)

	async def handle_identify(self):
		await self.ws_connection.send(json.dumps({
			'e': 'IDENTIFY',
			'd': {
				'token': os.getenv('BOT_TOKEN')
			}
		}))

	async def handle_join_match(self):
		await self.ws_connection.send(json.dumps({
			'e': 'MATCHMAKE_FORCE_JOIN',
			'd': {
				'match_id': self.match_id
			}
		}))

	async def handle_message(self, message):
		try:
			data = json.loads(message)
			event = data.get('e', None)

			match event:
				case 'HELLO':
					self.heartbeat_interval = int(data.get('heartbeat_interval', 1000))
					self.heartbeat_task = asyncio.create_task(self.heartbeat())
				case 'HEARTBEAT_ACK':
					self.heartbeat_ack += 1
				case 'READY':
					self.is_identified = True
				case 'MATCH_FORCE_JOIN_FAILED':
					event_data = data.get('d', {})
					raise Exception(f"Failed to join match: {event_data.get('reason', 'Unknown reason')}")
				case 'MATCH_END':
					raise Exception("Match has ended")
				case _:
					logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Unknown event: {event}")

		except json.JSONDecodeError:
			logger.error(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Invalid JSON format")
			return

	def run_listen(self):
		asyncio.run(self.listen())

	async def listen(self):
		logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Listening to {self.ws_url}")
		try:
			async with websockets.connect(self.ws_url, ssl=self.ssl_context) as ws:
				self.ws_connection = ws
				while True:
					message = await ws.recv()
					await self.handle_message(message)
		except websockets.exceptions.ConnectionClosedError:
			logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Connection closed")
		except Exception as e:
			logger.error(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Error: {type(e).__name__} - {e}")
		finally:
			logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Terminating listen process")
			if self.heartbeat_task:
				self.heartbeat_task.cancel()
			if self.listen_process:
				self.listen_process.close()
