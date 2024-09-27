# WebSocket Server for Game Handling

This document explains how the WebSocket server handles game connections.

## Connection Establishment

1. The client establishes a connection with the WebSocket server.

## Initial Handshake

2. Upon successful connection, the server sends a HELLO event:
   ```json
   {"e": "HELLO", "d": {"heartbeat_interval": 3000}}
   ```

## Heartbeat Mechanism

3. The client begins the heartbeat interval process:
   - The client sends `{"e": "HEARTBEAT"}` packets at the interval specified in the HELLO event.
   - The server always replies with a HEARTBEAT_ACK event.
   - This process continues for as long as the WebSocket remains open.
   - If the client misses three heartbeats, the server will close the connection.

## Client Identification

4. The client identifies itself by sending:
   ```json
   {"e": "IDENTIFY", "d": {"token": "userToken"}}
   ```

## Server Response

5. The server processes the identification:
   - If the token is valid, the server replies with a READY event containing the user's profile.
   - If the token is invalid, the server closes the connection.

## Matchmaking

The client can send a MATCHMAKE_REQUEST event containing a match_type (which can be 1v1 or ai)

Example: {"e": "MATCHMAKE_REQUEST", "d": {"match_type": "1v1"}}

The server will begin searching for a compatible game or create one if none are available of this type.

The server will then send a MATCH_JOIN event to the client with details about the match such as their paddle side (left or right)
and opponent if there is one.

If a user is the first player to join a match and there is no opponent, when an opponent joins they will receive
a PLAYER_JOIN event with the user object of the opponent including their side.

Example: {"e": "PLAYER_JOIN", "d": {"userID": "ekjeke", "username": "dd", "displayName": "eee", "avatarID": "eee"}}

## Match Events

After both players have joined, a `MATCH_BEGIN` event will be sent to all players inside the match. This event will contain
the initial paddle positions for both players and the initial ball position.

After 10 seconds, the game will start.

Throughout the game, at regular intervals of approximately 33ms (30 FPS), the server will send `MATCH_UPDATE` events which will contain both players'
paddle positions, the new ball position, and scores.

When the match ends (when a player reaches 10 points), the server will send a `MATCH_END` event to all clients containing a property `won` which is a boolean.

## Player Events

Players inside a match can send two types of events:

1. `PADDLE_MOVE` with a `direction` of "up" or "down" to the server. The server
will handle moving the paddle to the correct position and will instantly fire a `MATCH_UPDATE` to update clients on the new
positions of everyone's paddle, the ball, and scores.

2. `PLAYER_QUIT` which is sent by the player when they're leaving the match voluntarily.

The server uses heartbeats and close codes to check and handle abnormal disconnects and will terminate the match accordingly.

If a player quits or disconnects, the match will end and the other player will be declared the winner.