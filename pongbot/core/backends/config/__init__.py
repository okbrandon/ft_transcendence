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
			"speed": PADDLE_SPEED
		},
		"left_side_paddle_x": LEFT_SIDE_PADDLE_X,
		"right_side_paddle_x": RIGHT_SIDE_PADDLE_X,
		"required_params": REQUIRED_PARAMS,
		"fps_interval_ms": FPS_INTERVAL_MS,
		"min_send_interval_ms": MIN_SEND_INTERVAL_MS
	}
