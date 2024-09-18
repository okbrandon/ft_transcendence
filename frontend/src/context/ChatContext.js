import React, { createContext, useState } from "react";
import API from '../api/api';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:8888/ws/chat/?token=';

export const ChatContext = createContext({
	conversations: [],
});

const ChatProvider = ({ children }) => {
	const [conversations, setConversations] = useState([
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
            }
          ]
        },
        {
          "conversationID": "conv_MTcyNjMwMjg5NjQ2MDc7Mg",
          "conversationType": "private_message",
          "participants": [
            {
              "userID": "user_MTcyNjMwMTc5NTA5MjQ1MjA",
              "username": "johndoe",
              "displayName": null,
              "lang": "en",
              "avatarID": null,
              "bannerID": null,
              "bio": null,
              "flags": 1
            },
            {
              "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
              "username": "janedoe",
              "displayName": null,
              "lang": "en",
              "avatarID": null,
              "bannerID": null,
              "bio": null,
              "flags": 1
            }
          ],
          "messages": [
            {
              "messageID": "msg_MTcyNjMxOTU5OTk4MDg4MzI",
              "content": "Hi, nice to meet you!",
              "sender": {
                "userID": "user_MTcyNjMwMTc5NTA5MjQ1MjA",
                "username": "johndoe",
                "displayName": null,
                "lang": "en",
                "avatarID": null,
                "bannerID": null,
                "bio": null,
                "flags": 1
              },
              "createdAt": "2024-09-14T13:15:22.116212Z"
            },
            {
              "messageID": "msg_MTcyNjMxOTk2NDg4MjY2Mjc",
              "content": "Nice to meet you too!",
              "sender": {
                "userID": "user_MTcyNjMwMTkxMzk0Nzg5NTU",
                "username": "janedoe",
                "displayName": null,
                "lang": "en",
                "avatarID": null,
                "bannerID": null,
                "bio": null,
                "flags": 1
              },
              "createdAt": "2024-09-14T13:20:05.103983Z"
            }
          ]
        }
      ]);

	useWebSocket(WS_URL + localStorage.getItem('token'), {
		onOpen: () => console.log(`WebSocket connection opened:`),
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data.type === 'conversation_update') {
				API.get('chat/conversations')
					.then((response) => {
						console.log('(ChatMessages); Harvested data: ', response.data.conversations);
						setConversations(response.data.conversations);
					})
					.catch((error) => {
						console.log('FAILED TO HARVEST: ', error);
					});
			}
		},
	});

	return (
		<ChatContext.Provider value={{ conversations }}>
			{ children }
		</ChatContext.Provider>
	);
};

export default ChatProvider;
