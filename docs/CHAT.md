# CHAT API

This document outlines the API endpoints and data structures used for the chat feature. It allows users to send private messages to each other in real-time.

## Conversation update subscription

At authentication, the user connects to the server via a WebSocket connection. The server sends a notification to the user when a new message is received in one of their conversations. This means that the user needs to request the conversations. The WebSocket URL is `wss://localhost:8888/ws/chat/?token=X` where `X` represents the user's token.

Example of server notification:

```json
{
	"type": "conversation_update",
	"senderUsername": "Prune",
	"messagePreview": "Meow meow this is my long messag..."
}
```

## Requesting conversations

When needed, the user can ask the server for its conversations via `GET /chat/conversations`.

The `GET /chat/conversations` endpoint returns a list of conversations the user is part of. Each conversation contains the messages exchanged between the participants.

Example of server reply:

```json
{
    "conversations": [
        {
            "conversationID": "conv_MTcyNjMwMjg5NjQ2MDc3Mg",
            "conversationType": "private_message",
            "participants": [
                {
                    "userID": "user_MTcyNjMwMTc5NTA5MjQ1MjA",
                    "username": "bsoubaig",
                    "displayName": null,
                    "lang": "fr",
                    "avatarID": null,
                    "bannerID": null,
                    "bio": null,
                    "flags": 1
                },
                {
                    "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
                    "username": "evmorvan",
                    "displayName": null,
                    "lang": "fr",
                    "avatarID": null,
                    "bannerID": null,
                    "bio": null,
                    "flags": 1
                }
            ],
            "messages": [
                {
                    "messageID": "msg_MTcyNjMxOTU5OTk4MDg4MzI",
                    "content": "Hello, how are you?",
                    "sender": {
                        "userID": "user_MTcyNjMwMTc5NTA5MjQ1MjA",
                        "username": "bsoubaig",
                        "displayName": null,
                        "lang": "fr",
                        "avatarID": null,
                        "bannerID": null,
                        "bio": null,
                        "flags": 1
                    },
                    "createdAt": "2024-09-14T13:15:22.116212Z"
                },
                {
                    "messageID": "msg_MTcyNjMxOTk2NDg4MjY2Mjc",
                    "content": "YOU STINK BRO LMAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
                    "sender": {
                        "userID": "user_MTcyNjMwMTc5NTA5MjQ1MjA",
                        "username": "bsoubaig",
                        "displayName": null,
                        "lang": "fr",
                        "avatarID": null,
                        "bannerID": null,
                        "bio": null,
                        "flags": 1
                    },
                    "createdAt": "2024-09-14T13:20:05.103983Z"
                },
                {
                    "messageID": "msg_MTcyNjMyMDQ0MTU1NTM4MDM",
                    "content": "hello from evmorvan",
                    "sender": {
                        "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
                        "username": "evmorvan",
                        "displayName": null,
                        "lang": "fr",
                        "avatarID": null,
                        "bannerID": null,
                        "bio": null,
                        "flags": 1
                    },
                    "createdAt": "2024-09-14T13:32:17.885645Z"
                },
                {
                    "messageID": "msg_MTcyNjMyMTIzODM0ODYwNjk",
                    "content": "hello from evmorvan",
                    "sender": {
                        "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
                        "username": "evmorvan",
                        "displayName": null,
                        "lang": "fr",
                        "avatarID": null,
                        "bannerID": null,
                        "bio": null,
                        "flags": 1
                    },
                    "createdAt": "2024-09-14T13:40:53.990384Z"
                },
                {
                    "messageID": "msg_MTcyNjMyMTUxNTE3MTMyNzI",
                    "content": "bRO STOOP stinky poopy lol bro is ass dadoaoiaiodio",
                    "sender": {
                        "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
                        "username": "evmorvan",
                        "displayName": null,
                        "lang": "fr",
                        "avatarID": null,
                        "bannerID": null,
                        "bio": null,
                        "flags": 1
                    },
                    "createdAt": "2024-09-14T13:45:34.226679Z"
                }
            ]
        }
    ]
}
```

## Sending a message

When sending a message, the user sends a JSON object to the Websocket connection previously established at the authentication. The JSON object must contain the following fields:

```json
{
	"type": "send_message",
	"conversationID": "546a31fd-fb13-4b8f-8cbb-b3ac59c7d52c",
	"content": "Hello, how are you?"
}
```

Where the `conversationID` is the conversation ID where the message is sent and `content` is the message content.

Once received, the server will add the message to the conversation messages and send a Websocket notification to the participants of the conversation to tell them that they need to request the conversations again.