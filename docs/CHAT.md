# CHAT API

This document outlines the API endpoints and data structures used for the chat feature. It allows users to send private messages to each other in real-time.

## Conversation update subscription

At authentication, the user connects to the server via a WebSocket connection. The server sends a notification to the user when a new message is received in one of their conversations. This means that the user needs to request the conversations.

Example of server notification:

```json
{
	"type": "conversation_update"
}
```

## Requesting conversations

At authentication, the user asks the server for its conversations via `GET /chat/conversations`.

The `GET /chat/conversations` endpoint returns a list of conversations the user is part of. Each conversation contains the messages exchanged between the participants.

Example of server reply:

```json
"conversations": [
	{
		"id": "546a31fd-fb13-4b8f-8cbb-b3ac59c7d52c",
		"type": "private_message",
		"participantUserIDs": [ 1718350562393, 1718350562394 ],
		"userData": {
			"1718350562393": {
				"id": 1718350562393,
				"username": "Brandon",
				"displayName": "Brandon"
			},
			"1718350562394": {
				"id": 1718350562394,
				"username": "Prune",
				"displayName": "Prune"
			},
		},
		"messages": [
			{
				"id": "e546875a-0822-4fb8-af6f-3b3c8da9e089",
				"content": "Bro I'm Brandon ok who r u",
				"senderUserID": 1718350562393,
				"createdAt": "2024-08-29T09:08:37.475Z"
			},
			{
				"id": "01328fb7-cd8c-48e7-9c29-1b0e0d79030f",
				"content": "Meow meow stupid",
				"senderUserID": 1718350562394,
				"createdAt": "2024-08-29T09:08:49.907Z"
			}
		]
	},
	{
		"id": "8eb83551-dd47-4f8f-b91b-ff54a9a63258",
		"type": "private_message",
		"participantUserIDs": [ 1718350562393, 1718350562395 ],
		"userData": {
			"1718350562393": {
				"id": 1718350562393,
				"username": "Brandon",
				"displayName": "Brandon"
			},
			"1718350562395": {
				"id": 1718350562395,
				"username": "Bozo",
				"displayName": "Bozo"
			},
		},
		"messages": [
			{
				"id": "34bc7ca7-a02e-438b-9d75-fbe82ecb4a87",
				"content": "Hello I am Bozo",
				"senderUserID": 1718350562395,
				"createdAt": "2024-08-29T09:08:57.641Z"
			},
			{
				"id": "48a55e63-e59d-4dac-9c96-7a1d3ee828a5",
				"content": "Hi I am Brandon",
				"senderUserID": 1718350562393,
				"createdAt": "2024-08-29T09:09:07.557Z"
			}
		]
	}
]
```

## Sending a message

To send a message, the user sends a POST request to `/chat/conversations/:conversation_id/messages` with the following JSON body:

```json
{
	"id": "546a31fd-fb13-4b8f-8cbb-b3ac59c7d52c",
	"senderUserID": 1718350562393,
	"username": "Brandon",
	"displayName": "Brandon",
	"content": "Hello, how are you?"
}
```

Where the `id` is the conversation ID, `senderUserID` is the ID of the user sending the message, `username` is the username of the user sending the message, `displayName` is the display name of the user sending the message, and `content` is the message content.