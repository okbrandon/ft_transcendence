# Gateway

We can implement components like live chat, remote players, and server-side pong using WebSockets. This document aims to define how to establish a connection to the Gateway server, identify, start the heartbeating process, and send/receive messages.

## Heartbeating

Upon establishing a connection with the Gateway server at `wss://gateway`, you should receive a `HELLO` payload containing a `heartbeat_interval` in milliseconds. Starting when you've received the `HELLO` payload, you should begin sending `HEARTBEAT` payloads at the interval specified. This interval can change, and you should not hardcode it.

```
Establish a connection to the gateway server at wss://gateway
>>> {"evt": "hello", "data": {"heartbeat_interval": 45000}} // Received `HELLO` packet with heartbeat interval of 45000ms

start loop
    <<< {"evt": "heartbeat"} // Send a `HEARTBEAT` packet to the server
    >>> {"evt": "heartbeat_ack"} // Server responds with `HEARTBEAT_ACK` to confirm receipt of the heartbeat

    // Wait for the specified heartbeat interval before sending the next heartbeat
    wait 45000ms

    <<< {"evt": "heartbeat"} // Send another `HEARTBEAT` packet after the interval
    >>> {"evt": "heartbeat_ack"} // Server responds with `HEARTBEAT_ACK` again
end loop
```

Heartbeating is used to maintain an active connection between the client and server over WebSockets. By sending periodic "heartbeat" messages, the client confirms that the connection is still alive and functional. This helps prevent the connection from timing out due to inactivity.

## Identifying

Once we've started the heartbeating process, we can identify to the Gateway server by sending an `IDENTIFY` payload containing the User's token.

```json
{
  "evt": "identify",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0N"
  }
}
```

If the authentication is successful, you should receive a `READY` payload from the Gateway server, which looks like this:

```json
{
    "evt": "ready",
    "data": {
        "user": {
            "name": "evan",
            ...
        }
    }
}
```

If the authentication is unsuccessful, the client receives an `INVALID_SESSION` payload:

```json
{ "evt": "invalid_session" }
```

## Live Chat

### Channel Subscription

Each match has its own unique ID. Using a match's unique ID, you can subscribe to the match's chat and start sending and receiving messages. First, you need to send a `CHANNEL_SUBSCRIBE` payload that looks like this:

```json
{
  "evt": "channel_subscribe",
  "data": {
    "match_id": "33383922020"
  }
}
```

Once received, the Gateway server will respond with one of two possible payloads: `SUBSCRIBED` or `SUBSCRIPTION_FAILED`. The `SUBSCRIBED` payload contains the list of users in the channel and match-related information.

```json
{
    "evt": "subscribed",
    "data": {
        "match": {
            "id": "33383922020",
            ...
        },
        "users": [
            "3939393939",
            "4040404040",
            ...
        ]
    }
}
```

A subscription to a channel can fail for multiple reasons, including but not limited to: not having permission to access the match's live chat, being banned, blocked, or the live chat server being down. If that happens, you should receive a `SUBSCRIPTION_FAILED` payload specifying the reason.

```json
{
  "evt": "subscription_failed",
  "data": {
    "error": "You don't have permission to access this channel."
  }
}
```

### Receiving Channel Messages

After receiving a `SUBSCRIBED` payload from the Gateway, you should start receiving messages as they're sent by other users. Each message is sent separately using the `MESSAGE_RECEIVED` payload, which contains two properties: an author object with the username and id of the message author, and a message object with the channel id and the message content.

Example `MESSAGE_RECEIVED` payload:

```json
{
  "evt": "message_received",
  "data": {
    "user": {
      "name": "evan",
      "id": 3939393939
    },
    "message": {
      "content": "hello",
      "channel_id": 33383922020
    }
  }
}
```

### Sending Channel Messages

After receiving a `SUBSCRIBED` payload from the Gateway, you can start sending messages using the `MESSAGE_CREATE` payload, which should contain the message content and the channel id to send it to.

```json
{
  "evt": "message_create",
  "data": {
    "content": "my super message",
    "channel_id": 33383922020
  }
}
```

# Example JavaScript implementation

```js
const WebSocket = require("ws");

// Connecting to the gateway server
const ws = new WebSocket("wss://gateway");
let heartbeatInterval;

// Event handling for incoming messages
ws.on("message", (message) => {
  const payload = JSON.parse(message);
  switch (payload.evt) {
    case "HELLO":
      heartbeatInterval = payload.data.heartbeat_interval;
      startHeartbeating();
      identify();
      break;
    case "READY":
      console.log("Identification successful:", payload.data.user.name);
      break;
    case "INVALID_SESSION":
      console.log("Identification unsuccessful");
      break;
    case "SUBSCRIBED":
      console.log("Subscription successful. Users:", payload.data.users);
      break;
    case "SUBSCRIPTION_FAILED":
      console.log("Subscription failed. Error:", payload.data.error);
      break;
    case "MESSAGE_RECEIVED":
      console.log("Message received:", payload.data.message.content);
      break;
    default:
      console.log("Unhandled event:", payload.evt);
      break;
  }
});

function startHeartbeating() {
  setInterval(() => {
    ws.send(JSON.stringify({ evt: "HEARTBEAT" }));
  }, heartbeatInterval);
}

function identify() {
  ws.send(
    JSON.stringify({
      evt: "IDENTIFY",
      data: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0N" },
    })
  );
}

function sendMessage(content, channelId) {
  ws.send(
    JSON.stringify({
      evt: "MESSAGE_CREATE",
      data: { content, channel_id: channelId },
    })
  );
}

function subscribeToChannel(matchId) {
  ws.send(
    JSON.stringify({ evt: "CHANNEL_SUBSCRIBE", data: { match_id: matchId } })
  );
}
```
