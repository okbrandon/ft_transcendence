import React, { createContext, useEffect, useState } from "react";
import API from '../api/api';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = 'ws://localhost:8888/ws/chat/?token=';

export const ChatContext = createContext({
	conversations: [],
	sendMessage: () => {},
});

const ChatProvider = ({ children }) => {
	const [conversations, setConversations] = useState([]);
	const [messageHistory, setMessageHistory] = useState([]);
	const [socketUrl, setSocketUrl] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setSocketUrl(WS_URL + token);
		} else {
		console.error('Token not found for WebSocket connection');
		}
	}, []);

	const fetchConverations = () => {
		API.get('chat/conversations')
			.then((response) => {
				console.log('Received conversations:', response.data.conversations);
				setConversations(response.data.conversations);
			})
			.catch((error) => {
				console.error('Error fetching conversations:', error);
			});
	}

	const {
		sendMessage,
		lastMessage,
		readyState,
	} = useWebSocket(socketUrl, {
		onOpen: () => {
			console.log('WebSocket connection opened');
			fetchConverations();
		},
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			console.log('Received message:', data);

			if (data.type === 'conversation_update') {
				fetchConverations();
			}
		},
		onError: (error) => console.error('WebSocket error:', error),
		onClose: () => console.log('WebSocket connection closed'),
		shouldReconnect: (closeEvent) => true, // Reconnect on close
	});

	// Update message history when a new message is received
	useEffect(() => {
		if (lastMessage) {
			setMessageHistory((prev) => [...prev, lastMessage]);
		}
	}, [lastMessage]);

	// Log WebSocket connection status
    useEffect(() => {
		switch (readyState) {
			case ReadyState.CONNECTING:
				console.log("WebSocket is connecting...");
				break;
			case ReadyState.OPEN:
				console.log("WebSocket is open.");
				break;
			case ReadyState.CLOSING:
				console.log("WebSocket is closing...");
				break;
			case ReadyState.CLOSED:
				console.log("WebSocket is closed.");
				break;
			default:
				console.log("Unknown WebSocket state.");
		}
	}, [readyState]);

	return (
	<ChatContext.Provider value={{ conversations, sendMessage, messageHistory }}>
			{ children }
		</ChatContext.Provider>
	);
};

export default ChatProvider;
