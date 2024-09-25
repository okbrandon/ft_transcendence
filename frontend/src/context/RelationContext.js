import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import API from '../api/api';
import { useLocation } from "react-router-dom";
import logger from "../api/logger";

const WS_CHAT_URL = 'ws://localhost:8888/ws/chat/?token=';
const WS_STATUS_URL = 'ws://localhost:8888/ws/status/?token=';

export const RelationContext = createContext({
	conversations: [],
	sendMessage: () => {},
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
	const [conversations, setConversations] = useState([]);
	const [updatedFriend, setUpdatedFriend] = useState(null);

	const fetchConversations = useCallback(() => {
		API.get('chat/conversations')
			.then((response) => {
				setConversations(response.data.conversations);
			})
			.catch((error) => {
				console.error('Failed to fetch conversations:', error);
			});
	}, []);

	useEffect(() => {
		socketChat.current = new WebSocket(WS_CHAT_URL + localStorage.getItem('token'));
		socketChat.current.onopen = () => {
			logger('WebSocket for Chat connection opened');
			fetchConversations();
		};
		socketChat.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'conversation_update') {
				fetchConversations();
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
			else if (data.type === 'connection_event') {
				setUpdatedFriend(data.user);
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

	const sendMessage = useCallback((messageData) => {
		if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
			socketChat.current.send(messageData);
		} else {
			console.error('WebSocket for Chat is not open');
		}
	}, []);

	return (
		<RelationContext.Provider value={{ conversations, sendMessage, updatedFriend, setUpdatedFriend }}>
			{ children }
		</RelationContext.Provider>
	);
};

export default RelationProvider;
