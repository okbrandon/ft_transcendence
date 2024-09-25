User click on Play -> AI in the frontend:

POST to /matches with {"type": "ai"} -> create a match of type 'ai' and return a game token
(user uses the game token to connect to the ws)
(somehow give AI the game token)

User click on Play -> 1v1 in the frontend
POST to /matches with {"type": "1v1"} -> uses matchmaking api to find an available match or create one.
if we found a suitable match (same type, enough room) then we give the player the game token otherwise
we create a new match give the game token to the user and register the match for the matchmaking system.

When connecting to the ws, the user should send a game token.

After succesfully establishing connection the server will send a HEARTBEAT_INTERVAL event with as data `interval` which is the interval
at which the server will expect the client to the HEARTBEAT events. When receiving a HEARTBEAT event the server answers immediately
with a HEARTBEAT_ACK to the user.

If a user misses 3 heartbeats in a row we will make the user leave the match and make the remaining player win.
If the player leaves we will stop the game immediately and make the remaining player win.

Gateway events:
e: PLAYER_JOIN d: user profile data
e: PLAYER_LEAVE d: user profile data
e: PLAYER_SCORED d: user profile data of the user who scored and `scores` which contains both player scores.

e: GAME_START_SEQUENCE d: ?
e: GAME_BEGIN d: score and initial ball position
e: GAME_UPDATE d: game data containing scores, ball and paddles positions (sent at every ball move or paddle move)
e: GAME_ENDED d: `winner` either true for the winner or false for the looser `scores`

CAN ONLY BE SENT WHEN GAME HAS BEGUN:
e: PADDLE_UP d: paddle new location
e: PADDLE_DOWN d: paddle new location