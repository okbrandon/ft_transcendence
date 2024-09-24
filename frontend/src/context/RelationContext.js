import React, { createContext, useEffect, useRef, useState } from "react";
import API from '../api/api';
import { useLocation } from "react-router-dom";
import logger from "../api/logger";

const WS_CHAT_URL = 'ws://localhost:8888/ws/chat/?token=';
const WS_STATUS_URL = 'ws://localhost:8888/ws/status/?token=';

export const RelationContext = createContext({
	conversations: [],
});

const setActivity = (location) => {
	if (location === '/vs-ai' || location === '/vs-player') {
		return 'QUEUEING';
	} else if (location === '/solo-vs-ai') {
		return 'PLAYING_VS_AI';
	}
	return 'HOME';
};

const RelationProvider = ({ children }) => {
	const location = useLocation();
	const socketStatus = useRef(null);
	const socketChat = useRef(null);
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

	useEffect(() => {
		socketChat.current = new WebSocket(WS_CHAT_URL + localStorage.getItem('token'));
		socketChat.current.onopen = () => {
			logger('WebSocket for Chat connection opened');
		};
		socketChat.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'conversation_update') {
				API.get('chat/conversations')
					.then((response) => {
						setConversations(response.data.conversations);
					})
					.catch((error) => {
						console.error('Failed to update conversations:', error);
					});
			}
		};
		socketChat.current.onerror = (error) => {
			console.error('WebSocket for Chat encountered an error:', error);
		};

		socketStatus.current = new WebSocket(WS_STATUS_URL + localStorage.getItem('token'));
		socketStatus.current.onopen = () => {
			logger('WebSocket for Status connection opened');
		};
		socketStatus.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'heartbeat') {
				socketStatus.current.send(JSON.stringify({
					type: 'heartbeat',
					activity: setActivity('HOME')
				}));
			}
		};
		socketStatus.current.onerror = (error) => {
			console.error('WebSocket for Status encountered an error:', error);
		};

		return () => {
			if (socketChat.current) {
				socketChat.current.close();
				logger('WebSocket for Chat closed');
			}
			if (socketStatus.current) {
				socketStatus.current.close();
				logger('WebSocket for Status closed');
			}
		};
	}, []);

	useEffect(() => {
		if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
			socketStatus.current.send(JSON.stringify({
				type: 'heartbeat',
				activity: setActivity(location.pathname)
			}));
		}
	}, [location.pathname]);

	return (
		<RelationContext.Provider value={{ conversations }}>
			{ children }
		</RelationContext.Provider>
	);
};

export default RelationProvider;
