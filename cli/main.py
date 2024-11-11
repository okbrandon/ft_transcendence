import argparse
import asyncio
import json
import websockets
import os
import sys
import time
import logging
import requests
import ssl
import curses

# Constants
TERRAIN_WIDTH = 1200
TERRAIN_HEIGHT = 750
PADDLE_WIDTH = 1
PADDLE_HEIGHT = 6
BALL_RADIUS = 1
BALL_SPEED = 0.6
BALL_MAX_SPEED = 19
REFRESH_RATE = 1 / 60
PADDLE_CHAR = '█'  # Special ASCII character for paddle

# Game state
game_state = {
    "matchState": None,
    "player": None,
    "opponent": None,
    "playerSide": None,
    "gameOver": False,
    "gameStarted": False,
    "endGameData": None,
    "hitPos": None,
    "borderScore": None,
}

# Set up logging if debug mode is enabled
if os.environ.get("DEBUG") == "true":
    logging.basicConfig(filename='latest.log', level=logging.DEBUG, format='%(message)s')
    logger = logging.getLogger(__name__)

def draw_terrain(stdscr):
    stdscr.clear()
    
    height, width = stdscr.getmaxyx()
    
    if game_state["matchState"]:
        # Draw paddles (inverted)
        paddle_a_y = int((TERRAIN_HEIGHT - game_state["matchState"]["playerA"]["paddle_y"] - PADDLE_HEIGHT * (TERRAIN_HEIGHT / height)) / (TERRAIN_HEIGHT / height))
        paddle_b_y = int((TERRAIN_HEIGHT - game_state["matchState"]["playerB"]["paddle_y"] - PADDLE_HEIGHT * (TERRAIN_HEIGHT / height)) / (TERRAIN_HEIGHT / height))
        for i in range(PADDLE_HEIGHT):
            stdscr.addch(paddle_a_y + i, 0, PADDLE_CHAR)
            stdscr.addch(paddle_b_y + i, width - 1, PADDLE_CHAR)

        # Draw ball (inverted)
        ball_x = int(game_state["matchState"]["ball"]["x"] / (TERRAIN_WIDTH / width))
        ball_y = int((TERRAIN_HEIGHT - game_state["matchState"]["ball"]["y"]) / (TERRAIN_HEIGHT / height))
        stdscr.addch(ball_y, ball_x, '●')

    # Draw terrain borders
    stdscr.hline(0, 0, '-', width)
    stdscr.hline(height - 1, 0, '-', width)
    
    # Print scores
    if game_state["matchState"]:
        scores = game_state["matchState"]["scores"]
        player_a_score = scores.get(str(game_state["matchState"]["playerA"]["id"]), 0)
        player_b_score = scores.get(str(game_state["matchState"]["playerB"]["id"]), 0)
        score_text = f"Score: {player_a_score} - {player_b_score}"
        stdscr.addstr(0, (width - len(score_text)) // 2, score_text)

    stdscr.refresh()

async def send_heartbeat(websocket, interval):
    while True:
        heartbeat_message = json.dumps({"e": "HEARTBEAT"})
        await websocket.send(heartbeat_message)
        if os.environ.get("DEBUG") == "true":
            logger.debug(f"> {heartbeat_message}")
        await asyncio.sleep(interval / 1000)  # Convert milliseconds to seconds

async def handle_message(message, websocket, game_mode, stdscr):
    global game_state
    data = json.loads(message)
    event = data.get("e")

    if os.environ.get("DEBUG") == "true":
        logger.debug(f"< {message}")

    if event == "HELLO":
        heartbeat_interval = data["d"]["heartbeat_interval"]
        asyncio.create_task(send_heartbeat(websocket, heartbeat_interval))
        identify_message = json.dumps({
            "e": "IDENTIFY",
            "d": {"token": os.environ.get("TOKEN")}
        })
        await websocket.send(identify_message)
        if os.environ.get("DEBUG") == "true":
            logger.debug(f"> {identify_message}")
    elif event == "MATCH_READY":
        game_state["matchState"] = data["d"]
        stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, "Match is ready!")
        stdscr.refresh()
    elif event == "MATCH_BEGIN":
        game_state["gameStarted"] = True
        stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, "Match has begun!")
        stdscr.refresh()
    elif event == "MATCH_UPDATE":
        game_state["matchState"] = data["d"]
        draw_terrain(stdscr)
    elif event == "BALL_SCORED":
        game_state["borderScore"] = data["d"]["player"]
        stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, f"Ball scored by {data['d']['player']}!")
        stdscr.refresh()
    elif event == "MATCH_END":
        game_state["gameOver"] = True
        game_state["endGameData"] = data["d"]
        stdscr.clear()
        height, width = stdscr.getmaxyx()
        stdscr.addstr(height // 2, (width - 9) // 2, "Game Over!")
        stdscr.addstr(height - 1, 0, f"Winner: {data['d']['winner']['username']}")
        stdscr.refresh()
    elif event == "READY":
        game_state["player"] = data["d"]
        stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, f"You are playing as: {data['d']['username']}")
        stdscr.refresh()
        await asyncio.sleep(3)  # Wait for 3 seconds
        matchmake_request = json.dumps({
            "e": "MATCHMAKE_REQUEST",
            "d": {"match_type": game_mode}
        })
        await websocket.send(matchmake_request)
        if os.environ.get("DEBUG") == "true":
            logger.debug(f"> {matchmake_request}")
    elif event == "MATCH_JOIN":
        game_state["playerSide"] = data["d"]["side"]
        game_state["opponent"] = data["d"].get("opponent")
        if game_state["opponent"]:
            stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, f"Opponent joined: {game_state['opponent']['username']}")
            stdscr.refresh()
    elif event == "PLAYER_JOIN":
        if data["d"]["userID"] != game_state["player"]["userID"]:
            game_state["opponent"] = data["d"]
            stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, f"Opponent joined: {data['d']['username']}")
            stdscr.refresh()
    elif event == "PADDLE_HIT" or event == "BALL_HIT":
        game_state["hitPos"] = data["d"]["ball"]
        stdscr.addstr(stdscr.getmaxyx()[0]-1, 0, "Ball hit!")
        stdscr.refresh()

async def game_loop(websocket, game_mode, stdscr):
    last_draw_time = 0
    while not game_state["gameOver"]:
        try:
            message = await asyncio.wait_for(websocket.recv(), timeout=0.1)
            await handle_message(message, websocket, game_mode, stdscr)
        except asyncio.TimeoutError:
            pass

        if game_state["gameStarted"] and not game_state["gameOver"]:
            # Handle user input for paddle movement
            key = stdscr.getch()
            if key in [ord('w'), ord('W'), curses.KEY_UP]:
                paddle_move = json.dumps({
                    "e": "PADDLE_MOVE",
                    "d": {"direction": "up"}
                })
                await websocket.send(paddle_move)
                if os.environ.get("DEBUG") == "true":
                    logger.debug(f"> {paddle_move}")
            elif key in [ord('s'), ord('S'), curses.KEY_DOWN]:
                paddle_move = json.dumps({
                    "e": "PADDLE_MOVE",
                    "d": {"direction": "down"}
                })
                await websocket.send(paddle_move)
                if os.environ.get("DEBUG") == "true":
                    logger.debug(f"> {paddle_move}")

            # Redraw terrain at a fixed rate
            current_time = time.time()
            if current_time - last_draw_time >= REFRESH_RATE:
                draw_terrain(stdscr)
                last_draw_time = current_time

        await asyncio.sleep(0.01)  # Small sleep to prevent CPU overuse

async def main(stdscr):
    parser = argparse.ArgumentParser(description="CLI Pong Game")
    parser.add_argument("game_mode", choices=["ai", "1v1"], help="Game mode: ai or 1v1")
    args = parser.parse_args()

    # Set up curses
    curses.curs_set(0)  # Hide the cursor
    stdscr.nodelay(1)  # Make getch non-blocking
    curses.start_color()
    curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)
    stdscr.attron(curses.color_pair(1))

    # Get user profile before connecting
    token = os.environ.get("TOKEN")
    headers = {"Authorization": f"Bearer {token}"}
    base_url = "http://localhost:8000/api/v1" if os.environ.get("ENV") != "production" else ""
    profile_url = f"{base_url}/users/@me/profile"
    
    try:
        response = requests.get(profile_url, headers=headers)
        response.raise_for_status()
        user_profile = response.json()
        stdscr.addstr(0, 0, f"Welcome, {user_profile['username']}!")
        stdscr.refresh()
    except requests.RequestException as e:
        stdscr.addstr(0, 0, f"Failed to fetch user profile: {e}")
        stdscr.refresh()
        return

    uri = "wss://localhost:8888/ws/match" if os.environ.get("ENV") != "production" else "/ws/match"
    
    # Create a custom SSL context that doesn't verify the certificate
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    async with websockets.connect(uri, ssl=ssl_context) as websocket:
        await game_loop(websocket, args.game_mode, stdscr)

if __name__ == "__main__":
    curses.wrapper(lambda stdscr: asyncio.run(main(stdscr)))
