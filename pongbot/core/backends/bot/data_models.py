import json


"""
Represents the data of the ball
"""
class BallData:
	def __init__(self, x, y, dx, dy):
		self.x = x
		self.y = y
		self.dx = dx
		self.dy = dy

"""
Represents the data of the paddle
"""
class PaddleData:
	def __init__(self, y, position):
		self.y = y
		self.pos = position

"""
Represents the data of the game
"""
class MatchData:
	def __init__(self, ball_data: BallData, paddle_data: PaddleData):
		self.ball_data = ball_data
		self.paddle_data = paddle_data

"""

"""
class BotData:
	def __init__(self):
		self.ws_connection = None
		self.match_data = None
		self.bot_action_predictor = None
		self.should_predict = False

	def update_match_data(self, match_data: MatchData):
		self.match_data = match_data
