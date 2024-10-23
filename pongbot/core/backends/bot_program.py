import asyncio
import websockets
import logging
import ssl
import json
import os
import time

from multiprocessing import Process

from .config import get_config
from .bot.data_models import BotData, MatchData, BallData, PaddleData
from .bot.match_predictors import BotActionPredictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BotProgram:

	def __init__(self, **kwargs) -> None:
		self.config = get_config()
		self.ws_connection = None
		self.move_task = None
		self.heartbeat_task = None
		self.heartbeat_interval = None
		self.heartbeat_ack = 0

		self.is_identified = False

		self.match_started = False
		self.match_data = None
		self.bot_data = BotData()
		self.last_move_sent = time.time()

		self.host = kwargs.get('host', None)
		self.port = kwargs.get('port', None)
		self.match_id = kwargs.get('matchID', None)
		self.ws_url = self.config['ws_url'].format(self.host, self.port)

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
			if self.is_identified:
				if self.heartbeat_ack == 2:
					await self.handle_join_match()
				if self.match_started: # Considering the HEARTBEAT_INTERVAL is every second
					await self.handle_match_update()
			await asyncio.sleep(self.heartbeat_interval / 1000)

	async def handle_match_update(self):
		self.bot_data.update_match_data(self.match_data)
		try:
			self.bot_data.bot_action_predictor.velocity_estimator.vx = self.match_data.ball_data.dx
			self.bot_data.bot_action_predictor.velocity_estimator.vy = self.match_data.ball_data.dy
			if self.bot_data.should_predict:
				logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Should predict")
				self.bot_data.should_predict = False
				self.bot_data.bot_action_predictor.ball_predictor.predict_ball_land(self.match_data.ball_data, self.bot_data.bot_action_predictor.velocity_estimator)
		except Exception as e:
			logger.error(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Error: {type(e).__name__} - {e}")

	async def handle_match_move(self):
		now = time.time()

		if now - self.last_move_sent < self.config['paddle']['move_rate']:
			return
		await self.bot_data.bot_action_predictor.send_predicted_action(self.ws_connection)
		self.last_move_sent = now

	async def handle_paddle_move(self):
		while True:
			if not self.ws_connection:
				return
			if self.is_identified and self.match_started:
				await self.handle_match_move()
			await asyncio.sleep(self.config['paddle']['move_rate'])

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
					self.move_task = asyncio.create_task(self.handle_paddle_move())
					self.bot_data.bot_action_predictor = BotActionPredictor()
				case 'HEARTBEAT_ACK':
					self.heartbeat_ack += 1
				case 'READY':
					logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Ready to play")
					self.is_identified = True
				case 'MATCH_FORCE_JOIN_FAILED':
					event_data = data.get('d', {})
					raise Exception(f"Failed to join match: {event_data.get('reason', 'Unknown reason')}")
				case 'MATCH_END':
					raise Exception("Match has ended")
				case 'MATCH_BEGIN':
					logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Match has started")
					self.match_started = True
				case 'MATCH_UPDATE':
					event_data = data.get('d', {})
					ball_data = event_data.get('ball', {})
					paddle_data = event_data.get('playerB', {})
					self.match_data = MatchData(
						ball_data=BallData(
							x=ball_data.get('x', 0),
							y=ball_data.get('y', 0),
							dx=ball_data.get('dx', 0),
							dy=ball_data.get('dy', 0)
						),
						paddle_data=PaddleData(
							y=paddle_data.get('paddle_y', 0),
							position=paddle_data.get('pos', 'Unknown')
						)
					)
				case 'PADDLE_HIT':
					event_data = data.get('d', {})
					player_data = event_data.get('player', {})

					if player_data.get('pos') != 'A':
						return

					self.bot_data.should_predict = True
					await self.handle_match_update()
					self.bot_data.bot_action_predictor.predict_action(self.match_data)
				case 'PADDLE_RATE_LIMIT':
					logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] AI has been rate limited")
					self.bot_data.bot_action_predictor.paddle_state.refund_last_move()
				case _:
					event_data = data.get('d', {})
					logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Event: {event} - {event_data}")

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
				self.bot_data.ws_connection = ws
				while True:
					message = await ws.recv()
					await self.handle_message(message)
		except websockets.exceptions.ConnectionClosedError as e:
			logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Connection closed with code: {e.code}")
		except Exception as e:
			logger.error(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Error: {type(e).__name__} - {e}")
		finally:
			logger.info(f"[{self.__class__.__name__} | MatchID: {self.match_id}] Terminating listen process")
			if self.heartbeat_task:
				self.heartbeat_task.cancel()
			if self.move_task:
				self.move_task.cancel()
			if self.listen_process:
				self.listen_process.close()
