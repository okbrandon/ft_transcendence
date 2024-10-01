import asyncio
import websockets
import json
from datetime import datetime
import urllib.parse

async def connect_websocket(token):
    uri = f"ws://localhost:8888/ws/game"
    
    async with websockets.connect(uri) as websocket:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Connected to WebSocket server")

        # Handle incoming messages
        async def receive_messages():
            while True:
                try:
                    message = await websocket.recv()
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] < {message}")
                    
                    # Handle HELLO message
                    data = json.loads(message)
                    if data['e'] == 'HELLO':
                        heartbeat_interval = data['d']['heartbeat_interval'] / 1000  # Convert to seconds
                        asyncio.create_task(send_heartbeat(websocket, heartbeat_interval))
                        
                        # Send IDENTIFY message
                        identify_message = json.dumps({"e": "IDENTIFY", "d": {"token": token}})
                        await websocket.send(identify_message)
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] > {identify_message}")
                    elif data['e'] == 'READY':
                        # Send MATCHMAKE_REQUEST message
                        matchmake_request = json.dumps({"e": "MATCHMAKE_REQUEST", "d": {"match_type": "1v1"}})
                        await websocket.send(matchmake_request)
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] > {matchmake_request}")
                    elif data['e'] == 'MATCH_JOIN':
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] Joined match: {data['d']}")
                    elif data['e'] == 'PLAYER_JOIN':
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] Opponent joined: {data['d']}")
                    elif data['e'] == 'MATCH_BEGIN':
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] Match beginning: {data['d']}")
                except websockets.exceptions.ConnectionClosed:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] WebSocket connection closed")
                    break

        # Send heartbeat messages
        async def send_heartbeat(websocket, interval):
            while True:
                await asyncio.sleep(interval)
                heartbeat_message = json.dumps({"e": "HEARTBEAT"})
                await websocket.send(heartbeat_message)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] > {heartbeat_message}")

        await receive_messages()

if __name__ == "__main__":
    token = input("Enter your token: ")
    asyncio.run(connect_websocket(token))
