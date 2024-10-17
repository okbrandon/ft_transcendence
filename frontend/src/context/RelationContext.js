import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import API from '../api/api';
import { useLocation } from "react-router-dom";
import logger from "../api/logger";
import { formatUserData } from "../api/user";
import { getBlockedUsers, getFriends, getRequests } from "../scripts/relation";
import { useNotification } from "./NotificationContext";

const WS_CHAT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/chat/?token=' : 'ws://localhost:8000/ws/chat/?token=';
const WS_STATUS_URL =  process.env.REACT_APP_ENV === 'production' ? '/ws/status/?token=' : 'ws://localhost:8000/ws/status/?token=';
const WS_TOURNAMENT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/tournament/?token=' : 'ws://localhost:8000/ws/tournament/?token=';

export const RelationContext = createContext({
	conversations: [],
});

const RelationProvider = ({ children }) => {
	const location = useLocation();
	const { addNotification } = useNotification();
	const socketStatus = useRef(null);
	const socketChat = useRef(null);
	const socketTournament = useRef(null);
	const pathnameRef = useRef(location.pathname);
	const [conversations, setConversations] = useState([]);
	const [relations, setRelations] = useState([]);
	const [friends, setFriends] = useState([]);
	const [requests, setRequests] = useState([]);
	const [blockedUsers, setBlockedUsers] = useState([]);
	const [isRefetch, setIsRefetch] = useState(false);

	const setActivity = location => {
		if (location === '/game-ai') {
			return 'PLAYING_VS_AI';
		} else if (location === '/game-classic') {
			return 'PLAYING_MULTIPLAYER';
		} else if (location === '/game-local') {
			return 'PLAYING_LOCAL';
		}
		return 'HOME';
	};

	const sendMessage = (message) => {
		if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
			socketChat.current.send(message);
		} else {
			logger('WebSocket for Chat is not open');
		}
	};

	useEffect(() => {
		API.get('users/@me/relationships')
			.then(relationships => {
				setRelations(relationships.data);
				setFriends(getFriends(relationships.data));
				setRequests(getRequests(relationships.data));
				setBlockedUsers(getBlockedUsers(relationships.data));

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
			})
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

		return () => {
			if (socketChat.current && socketChat.current.readyState === WebSocket.OPEN) {
				socketChat.current.close();
				logger('WebSocket for Chat closed');
			}
		};
	}, [addNotification]);

	useEffect(() => {
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

		return () => {
			if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
				socketStatus.current.close();
				logger('WebSocket for Status closed');
			}
		};
	}, []);

	useEffect(() => {
		socketTournament.current = new WebSocket(WS_TOURNAMENT_URL + localStorage.getItem('token'));
		socketTournament.current.onopen = () => {
			logger('WebSocket for Tournament connection opened');
			socketTournament.current.send(JSON.stringify({
				"e": "IDENTIFY",
				"d": { "token": localStorage.getItem('token') }
			}));
		};
		socketTournament.current.onmessage = event => {
			const response = JSON.parse(event.data);
			if (response.e === "HELLO") {
				// Start heartbeat
				setInterval(() => {
					socketTournament.current.send(JSON.stringify({
						"e": "HEARTBEAT"
					}));
				}, response.d.heartbeat_interval);
			} else if (response.e === "HEARTBEAT_ACK") {
				// Heartbeat acknowledged
			} else {
				// Handle other tournament-related messages here
				console.log('Tournament message received:', response);
			}
		};
		socketTournament.current.onerror = error => {
			console.error('WebSocket for Tournament encountered an error:', error);
		};

		return () => {
			if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
				socketTournament.current.close();
				logger('WebSocket for Tournament closed');
			}
		};
	}, []);

	useEffect(() => {
		pathnameRef.current = location.pathname;
	}, [location.pathname]);

	return (
		<RelationContext.Provider value={{
			conversations,
			setConversations,
			sendMessage,			// send a message
			relations,				// get the relations
			setRelations,			// change the relations
			friends,				// get the friends
			setFriends,				// change the friends
			requests,				// get the requests users
			setRequests,			// change the requests
			blockedUsers,			// get the blocked users
			setBlockedUsers,		// change the blocked users
			setIsRefetch,			// refetch the relations when set to true
		}}>
			{ children }
		</RelationContext.Provider>
	);
};

export const useRelation = () => useContext(RelationContext);

export default RelationProvider;
