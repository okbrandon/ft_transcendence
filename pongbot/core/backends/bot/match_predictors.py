import math
import logging
import json

from ..config import get_config
from .data_models import BallData


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
Estimates the velocity of the ball
"""
class BallVelocityEstimator:
	def __init__(self):
		self.prev_x = None
		self.prev_y = None
		self.vx = 0
		self.vy = 0
		self.speed = 0

	def update_velocity(self, current_x, current_y):
		if self.prev_x is not None and self.prev_y is not None:
			self.vx = current_x - self.prev_x
			self.vy = current_y - self.prev_y
			self.speed = math.sqrt(self.vx ** 2 + self.vy ** 2)

		self.prev_x = current_x
		self.prev_y = current_y

"""
Predicts the future position of the ball
"""
class BallPredictor:
	def __init__(self, court_width, court_height, ball_radius):
		self.court_width = court_width
		self.court_height = court_height
		self.ball_radius = ball_radius
		self.ball_predicted_y = 0
		self.config = get_config()

	def predict_ball_land(self, ball_data: BallData, velocity: BallVelocityEstimator):
		if velocity.vx == 0:
			return

		velocity.vx = abs(velocity.vx)

		time_to_reach_paddle = (self.config['right_side_paddle_x'] - ball_data.x) / velocity.vx
		predicted_y = ball_data.y + velocity.vy * time_to_reach_paddle

		bounces = 0
		while predicted_y < 0 or predicted_y > self.court_height:
			if predicted_y < 0:
				predicted_y = -predicted_y
				bounces += 1
			elif predicted_y > self.court_height:
				predicted_y = 2 * self.court_height - predicted_y
				bounces += 1

		self.ball_predicted_y = predicted_y

		logger.info(f"[{self.__class__.__name__}] -- PREDICTION LOGS --")
		logger.info(f"[{self.__class__.__name__}] Time to reach paddle: {time_to_reach_paddle}")
		logger.info(f"[{self.__class__.__name__}] Predicted Y: {self.ball_predicted_y}")
		logger.info(f"[{self.__class__.__name__}] Bounces: {bounces}")
		logger.info(f"[{self.__class__.__name__}] --")
		logger.info(f"[{self.__class__.__name__}] Ball Velocity X: {velocity.vx}, Ball Velocity Y: {velocity.vy}")
		logger.info(f"[{self.__class__.__name__}] -- END PREDICTION LOGS --")

"""
Predicts the action of the bot
"""
class BotActionPredictor:

	class PaddleState:
		def __init__(self):
			self.imaginary_y = 0
			self.y_to_reach = 0
			self.should_move_up = False
			self.should_move_down = False
			self.config = get_config()
			self.last_move_sent = 0

		def reset(self):
			logger.info(f"[{self.__class__.__name__}] Target reached, resetting paddle state")
			logger.info(f"[{self.__class__.__name__}] Imaginary Y: {self.imaginary_y}, Y to reach: {self.y_to_reach}")
			self.imaginary_y = 0
			self.y_to_reach = 0
			self.should_move_up = False
			self.should_move_down = False

		def calculate_move(self):
			if self.should_move_up:
				return self.move_paddle('up', self.imaginary_y < self.y_to_reach)
			elif self.should_move_down:
				return self.move_paddle('down', self.imaginary_y > self.y_to_reach)
			return None

		def move_paddle(self, direction, condition):
			if condition:
				self.last_move_sent = self.config['paddle']['speed'] if direction == 'up' else -self.config['paddle']['speed']
				self.imaginary_y += self.last_move_sent
				return direction
			else:
				self.reset()
				return None

		def refund_last_move(self):
			self.imaginary_y -= self.last_move_sent

	def __init__(self):
		self.config = get_config()
		self.velocity_estimator = BallVelocityEstimator()
		self.ball_predictor = BallPredictor(
			self.config['court']['width'],
			self.config['court']['height'],
			self.config['ball']['radius']
		)
		self.paddle_state = self.PaddleState()

	def predict_action(self, match_data):
		predicted_y = self.ball_predictor.ball_predicted_y
		paddle_pos = match_data.paddle_data.y

		self.paddle_state.y_to_reach = predicted_y
		self.paddle_state.imaginary_y = abs(match_data.paddle_data.y)

		logger.info(f"[{self.__class__.__name__}] Predicted Y: {predicted_y}, Player Y: {match_data.paddle_data.y}")
		logger.info(f"[{self.__class__.__name__}] Y to reach: {self.paddle_state.y_to_reach}, Imaginary Y: {self.paddle_state.imaginary_y}")

		if predicted_y > paddle_pos:
			self.paddle_state.should_move_up = True
			self.paddle_state.should_move_down = False
			logger.info(f"[{self.__class__.__name__}] Should move UP")
		elif predicted_y < paddle_pos:
			self.paddle_state.should_move_up = False
			self.paddle_state.should_move_down = True
			logger.info(f"[{self.__class__.__name__}] Should move DOWN")
		else:
			self.paddle_state.should_move_up = False
			self.paddle_state.should_move_down = False
			logger.info(f"[{self.__class__.__name__}] Should NOT move")

	async def send_predicted_action(self, ws_connection):
		move = self.paddle_state.calculate_move()

		if move:
			await ws_connection.send(json.dumps({
				"e": "PADDLE_MOVE",
				"d": {
					"direction": move
				}
			}))
