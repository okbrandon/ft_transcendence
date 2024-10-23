from .settings import *

def get_config():
	return {
		"ws_url": WS_URL,
		"court": {
			"width": COURT_WIDTH,
			"height": COURT_HEIGHT
		},
		"ball": {
			"radius": BALL_RADIUS
		},
		"paddle": {
			"height": PADDLE_HEIGHT,
			"speed": PADDLE_SPEED,
			"move_rate": PADDLE_MOVE_RATE
		},
		"left_side_paddle_x": LEFT_SIDE_PADDLE_X,
		"right_side_paddle_x": RIGHT_SIDE_PADDLE_X
	}
