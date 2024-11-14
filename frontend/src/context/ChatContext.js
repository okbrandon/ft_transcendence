import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import API from '../api/api';
import { formatUserData } from '../api/user';
import { useNotification } from './NotificationContext';
import { useRelation } from './RelationContext';
import { useNavigate } from 'react-router-dom';
import refreshToken from '../api/token';
import { useTranslation } from 'react-i18next';

const WS_CHAT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/chat/?token=' : 'ws://localhost:8000/ws/chat/?token=';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const socketChat = useRef(null);
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { isRefetch, setIsRefetch } = useRelation();
	const [conversations, setConversations] = useState([]);
	const [unreadCounts, setUnreadCounts] = useState({});
	const [sendNotification, setSendNotification] = useState(null);
	const { t } = useTranslation();
	const tRef = useRef(t);

	// State for managing direct messages
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});
	const directMessageRef = useRef(directMessage);

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
		}
	}, []);

	useEffect(() => {
		directMessageRef.current = directMessage;
	}, [directMessage]);

	useEffect(() => {
		if (!directMessage?.isMinimized && directMessage?.conversationID) {
			setUnreadCounts(prevUnreadCounts => ({
				...prevUnreadCounts,
				[directMessage.conversationID]: 0,
			}));
		}
	}, [directMessage?.isMinimized, directMessage?.conversationID]);

	useEffect(() => {
		if (!isRefetch) return;
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
				const initialUnreadCounts = {};
				newConversations.forEach(conversation => {
					if (initialUnreadCounts[conversation.conversationID] === undefined) {
						initialUnreadCounts[conversation.conversationID] = 0;
					}
				});
				setUnreadCounts(prevUnreadCounts => ({
					...initialUnreadCounts,
					...prevUnreadCounts,
				}));
				setConversations(newConversations);
			})
			.catch(err => {
				console.error(err?.response?.data?.error || 'An error occurred.');
			});
	}, [isRefetch]);

	useEffect(() => {
		if (sendNotification) {
			addNotification('info', tRef.current('chat.notifications.messageReceived', { username: `${sendNotification}` }));
			setSendNotification(null);
		}
	}, [sendNotification, addNotification]);

	useEffect(() => {
		const connectWSChat = async () => {
			if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
				socketChat.current.close();
			}

			let token = localStorage.getItem('token');
			if (!token) {
				token = await refreshToken();
				if (!token) {
					console.error('Unable to refresh the token. Websocket connection aborted.');
					return;
				}
			}

			socketChat.current = new WebSocket(WS_CHAT_URL + token);

			socketChat.current.onopen = () => {};

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
						if (directMessageRef.current?.conversationID === conversationID
							&& directMessageRef.current?.isOpen
							&& !directMessageRef.current?.isMinimized) {
							setUnreadCounts(prevUnreadCounts => ({
								...prevUnreadCounts,
								[conversationID]: 0,
							}));
						} else {
							setUnreadCounts(prevUnreadCounts => ({
								...prevUnreadCounts,
								[conversationID]: (prevUnreadCounts[conversationID] || 0) + 1,
							}));
							setSendNotification(message.sender.displayName);
						}
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
						addNotification('info', tRef.current('chat.notifications.friendRequest.received', { username: `${userFrom.displayName}` }));
					} else if (userFrom.status === 'rejected') {
						addNotification('info', tRef.current('chat.notifications.friendRequest.declined', { username: `${userTo.displayName}` }));
					} else if (userFrom.status === 'accepted') {
						addNotification('info', tRef.current('chat.notifications.friendRequest.accepted', { username: `${userTo.displayName}` }));
					};
				} else if (response.type === 'upcoming_match') {
					addNotification('crab', response.message.content);
				} else if (response.type === 'challenge_update') {
					const formattedData = {
						...response,
						inviter: formatUserData(response.invite.inviter),
						invitee: formatUserData(response.invite.invitee),
					}

					if (formattedData.invite.status === 'DECLINED') {
						addNotification('info', tRef.current('chat.notifications.challenge.accepted', { username: `${formattedData.invite.invitee.displayName}` }));
					} else if (formattedData.invite.status === 'ACCEPTED') {
						addNotification('info', tRef.current('chat.notifications.challenge.declined', { username: `${formattedData.invite.invitee.displayName}` }));
						navigate('/game-challenge');
					}
				}
			};

			socketChat.current.onerror = error => {
				console.error('WebSocket for Chat encountered an error:', error);
			};

			socketChat.current.onclose = async event => {
				if (event.code === 1006) {
					const newToken = await refreshToken();
					if (newToken) {
						connectWSChat();
					}
				}
			};
		}

		connectWSChat();

		return () => {
			if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
				socketChat.current.close();
			}
		};
	}, [addNotification, setIsRefetch, navigate]);

	const contextValue = useMemo(() => ({
		conversations,
		setConversations,
		directMessage,
		setDirectMessage,
		handleSelectChat,
		handleCloseChat,
		sendMessage,
		unreadCounts,
	}), [conversations, directMessage, handleSelectChat, handleCloseChat, sendMessage, unreadCounts]);

	return (
		<ChatContext.Provider value={contextValue}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
