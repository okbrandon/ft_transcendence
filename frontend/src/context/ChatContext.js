import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import logger from '../api/logger';
import API from '../api/api';
import { formatUserData } from '../api/user';
import { useNotification } from './NotificationContext';
import { useRelation } from './RelationContext';

const WS_CHAT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/chat/?token=' : 'ws://localhost:8000/ws/chat/?token=';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const socketChat = useRef(null);
	const { addNotification } = useNotification();
	const { isRefetch, setIsRefetch } = useRelation();
	const [conversations, setConversations] = useState([]);

	// State for managing direct messages
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});

	// Function to Select a Chat
	const handleSelectChat = useCallback((username, conversationID) => {
		setDirectMessage({
			isOpen: true,
			isMinimized: false,
			username,
			conversationID,
		});
	}, []);

	// Function to Close a Chat
	const handleCloseChat = useCallback(() => {
		setDirectMessage({
			isOpen: false,
			isMinimized: false,
			username: null,
			conversationID: null,
		});
	}, []);

	const sendMessage = useCallback(message => {
		if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
			socketChat.current.send(message);
		} else {
			logger('WebSocket for Chat is not open');
		}
	}, []);

	useEffect(() => {
		if (!isRefetch) return;
		console.log(`isRefetch: ${isRefetch}`);
		API.get('chat/conversations')
			.then(response => {
				const newConversations = [
					...response.data.conversations.map(conversation => ({
						...conversation,
						participants: conversation.participants.map(formatUserData),
						messages: conversation.messages.map(message => ({
							...message,
							sender: formatUserData(message.sender),
						}))
					}))
				];
				setConversations(newConversations);
			})
			.catch(err => {
				console.error(err?.response?.data?.error || 'An error occurred.');
			});
	}, [isRefetch]);

	useEffect(() => {
		const fetchConversations = () => {
			API.get('chat/conversations')
				.then(response => {
					const newConversations = [
						...response.data.conversations.map(conversation => ({
							...conversation,
							participants: conversation.participants.map(formatUserData),
							messages: conversation.messages.map(message => ({
								...message,
								sender: formatUserData(message.sender),
							}))
						}))
					];
					setConversations(newConversations);
				})
				.catch(error => {
					console.error('Failed to fetch conversations:', error);
				});
		};

		const connectWSChat = () => {
			socketChat.current = new WebSocket(WS_CHAT_URL + localStorage.getItem('token'));
			socketChat.current.onopen = () => {
				logger('WebSocket for Chat connection opened');
				fetchConversations();
			};
			socketChat.current.onmessage = event => {
				const response = JSON.parse(event.data);
				if (response.type === 'conversation_update') {
					const conversationID = response.conversationID;
					const message = response.message;

					setConversations(prevConversations => {
						const updatedConversations = prevConversations.map(conversation => {
							if (conversation.conversationID === conversationID) {
								return {
									...conversation,
									messages: conversation.messages.concat({
										...message,
										sender: formatUserData(message.sender),
									})
								};
							}
							return conversation;
						});
						return updatedConversations;
					});
				} else if (response.type === 'friend_request') {
					const userFrom = formatUserData({
						...response.data.from,
						status: response.status
					});
					const userTo = formatUserData({
						...response.data.to,
						status: response.status
					});
					setIsRefetch(true);
					if (userFrom.status === 'pending') {
						addNotification('info', `You have a friend request from ${userFrom.displayName}.`);
					} else if (userFrom.status === 'rejected') {
						addNotification('info', `${userTo.displayName} rejected your friend request.`);
					} else if (userFrom.status === 'accepted') {
						addNotification('info', `${userTo.displayName} accepted your friend request.`);
					};
				}
			};
			socketChat.current.onerror = error => {
				console.error('WebSocket for Chat encountered an error:', error);
			};
			socketChat.current.onclose = event => {
				if (event.code === 1006) {
					logger('WebSocket for Chat encountered an error: Connection closed unexpectedly');
					connectWSChat();
				}
			};
		}

		connectWSChat();

		return () => {
			if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
				socketChat.current.close();
				logger('WebSocket for Chat closed');
			}
		};
	}, [addNotification, setIsRefetch]);

	const contextValue = useMemo(() => ({
		conversations,
		setConversations,
		directMessage,
		setDirectMessage,
		handleSelectChat,
		handleCloseChat,
		sendMessage,
	}), [conversations, directMessage, handleSelectChat, handleCloseChat, sendMessage]);

	return (
		<ChatContext.Provider value={contextValue}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
