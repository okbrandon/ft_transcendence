import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import API from '../api/api';
import { useLocation } from "react-router-dom";
import logger from "../api/logger";
import { formatUserData } from "../api/user";
import { getBlockedUsers, getFriends, getRequests } from "../scripts/relation";
import { useNotification } from "./NotificationContext";

const WS_CHAT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/chat/?token=' : 'ws://localhost:8000/ws/chat/?token=';
const WS_STATUS_URL =  process.env.REACT_APP_ENV === 'production' ? '/ws/status/?token=' : 'ws://localhost:8000/ws/status/?token='

export const RelationContext = createContext({
	conversations: [],
});

const RelationProvider = ({ children }) => {
	const location = useLocation();
	const { addNotification } = useNotification();
	const socketStatus = useRef(null);
	const socketChat = useRef(null);
	const pathnameRef = useRef(location.pathname);
	const [conversations, setConversations] = useState([]);
	const [relations, setRelations] = useState([]);
	const [friends, setFriends] = useState([]);
	const [requests, setRequests] = useState([]);
	const [blockedUsers, setBlockedUsers] = useState([]);
	const [isRefetch, setIsRefetch] = useState(true);
	const userID = useRef(localStorage.getItem('userID'));

	// State for managing direct messages
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});

	// Function to Select a Chat
	const handleSelectChat = (username, conversationID) => {
		setDirectMessage({
			isOpen: true,
			isMinimized: false,
			username,
			conversationID,
		});
	}

	// Function to Close a Chat
	const handleCloseChat = () => {
		setDirectMessage({
			isOpen: false,
			isMinimized: false,
			username: null,
			conversationID: null,
		});
	}

	const setActivity = useCallback(location => {
		if (location === '/game-ai') {
			return 'PLAYING_VS_AI';
		} else if (location === '/game-classic') {
			return 'PLAYING_MULTIPLAYER';
		} else if (location === '/game-local') {
			return 'PLAYING_LOCAL';
		}
		return 'HOME';
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
		API.get('users/@me/relationships')
			.then(relationships => {
				setRelations(relationships.data);
				setFriends(getFriends(relationships.data, userID.current));
				setRequests(getRequests(relationships.data, userID.current));
				setBlockedUsers(getBlockedUsers(relationships.data, userID.current));

				// handle conversations when there is a change in relation status
				return API.get('chat/conversations');
			})
			.then(response => {
				setConversations(response.data.conversations);
			})
			.catch(err => {
				console.error(err?.response?.data?.error || 'An error occurred.');
			})
			.finally(() => {
				setIsRefetch(false);
			});
	}, [isRefetch]);

	useEffect(() => {
		const fetchConversations = () => {
			API.get('chat/conversations')
				.then(response => {
					setConversations(response.data.conversations);
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
					fetchConversations();
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
	}, [addNotification]);

	useEffect(() => {
		const connectWSStatus = () => {
			socketStatus.current = new WebSocket(WS_STATUS_URL + localStorage.getItem('token'));
			socketStatus.current.onopen = () => {
				logger('WebSocket for Status connection opened');
			};
			socketStatus.current.onmessage = event => {
				const response = JSON.parse(event.data);
				if (response.type === 'heartbeat') {
					socketStatus.current.send(JSON.stringify({
						type: 'heartbeat',
						activity: setActivity(pathnameRef.current)
					}));
				} else if (response.type === 'connection_event') {
					setIsRefetch(true);
				}
			};
			socketStatus.current.onerror = error => {
				console.error('WebSocket for Status encountered an error:', error);
			};
			socketStatus.current.onclose = event => {
				if (event.code === 1006) {
					logger('WebSocket for Status encountered an error: Connection closed unexpectedly');
					connectWSStatus();
				}
			}
		}

		connectWSStatus();

		return () => {
			if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
				socketStatus.current.close();
				logger('WebSocket for Status closed');
			}
		};
	}, [setActivity]);

	useEffect(() => {
		pathnameRef.current = location.pathname;
	}, [location.pathname]);

	const contextValue = useMemo(() => ({
		conversations,
		setConversations,
		sendMessage,
		relations,
		setRelations,
		friends,
		setFriends,
		requests,
		setRequests,
		blockedUsers,
		setBlockedUsers,
		isRefetch,
		setIsRefetch,

		directMessage,
		setDirectMessage,
		handleSelectChat,
		handleCloseChat,
	}), [relations, friends, requests, blockedUsers, isRefetch, conversations, sendMessage, directMessage]);

	return (
		<RelationContext.Provider value={contextValue}>
			{ children }
		</RelationContext.Provider>
	);
};

export const useRelation = () => useContext(RelationContext);

export default RelationProvider;
