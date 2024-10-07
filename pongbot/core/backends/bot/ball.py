import math


"""
Represents the data of the ball
"""
class BallData:
	def __init__(self, x, y):
		self.x = x
		self.y = y


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

	def predict_ball_land(self, ball_data: BallData, velocity: BallVelocityEstimator, opponent_on_right=True):
		if velocity.vx == 0:
			return

		if opponent_on_right:
			distance_to_paddle = self.court_width - ball_data.x - self.ball_radius
		else:
			distance_to_paddle = ball_data.x - self.ball_radius

		time_to_reach_paddle = distance_to_paddle / abs(velocity.vx)
		predicted_y_position = ball_data.y + velocity.vy * time_to_reach_paddle

		while predicted_y_position < 0 or predicted_y_position > self.court_height:
			if predicted_y_position < 0:
				predicted_y_position = -predicted_y_position
			elif predicted_y_position > self.court_height:
				predicted_y_position = 2 * self.court_height - predicted_y_position

		self.ball_predicted_y = predicted_y_position
