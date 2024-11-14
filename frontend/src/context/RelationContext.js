import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import API from '../api/api';
import { useLocation } from "react-router-dom";
import { getBlockedUsers, getFriends, getRequests } from "../scripts/relation";
import { ChatProvider } from "./ChatContext";
import refreshToken from "../api/token";

const WS_STATUS_URL =  process.env.REACT_APP_ENV === 'production' ? '/ws/status/?token=' : 'ws://localhost:8000/ws/status/?token='

export const RelationContext = createContext({
	conversations: [],
});

const RelationProvider = ({ children }) => {
	const location = useLocation();
	const socketStatus = useRef(null);
	const pathnameRef = useRef(location.pathname);
	const [relations, setRelations] = useState([]);
	const [friends, setFriends] = useState([]);
	const [requests, setRequests] = useState([]);
	const [blockedUsers, setBlockedUsers] = useState([]);
	const [isRefetch, setIsRefetch] = useState(true);
	const userID = localStorage.getItem('userID');

	const setActivity = useCallback(location => {
		if (location === '/game-ai') {
			return 'PLAYING_VS_AI';
		} else if (location === '/game-classic' || location === '/game-challenge') {
			return 'PLAYING_MULTIPLAYER';
		} else if (location === '/game-local') {
			return 'PLAYING_LOCAL';
		}
		return 'HOME';
	}, []);

	useEffect(() => {
		if (!isRefetch) return;
		API.get('users/@me/relationships')
			.then(relationships => {
				setRelations(relationships.data);
				setFriends(getFriends(relationships.data, userID));
				setRequests(getRequests(relationships.data, userID));
				setBlockedUsers(getBlockedUsers(relationships.data, userID));
			})
			.catch(err => {
				console.error(err?.response?.data?.error || 'An error occurred.');
			})
			.finally(() => {
				setIsRefetch(false);
			});
	}, [isRefetch, userID]);

	useEffect(() => {
		const connectWSStatus = async () => {
			if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
				socketStatus.current.close();
			}

			let token = localStorage.getItem('token');
			if (!token) {
				token = await refreshToken();
				if (!token) {
					console.error('Unable to refresh the token. Websocket connection aborted.');
					return;
				}
			}

			socketStatus.current = new WebSocket(WS_STATUS_URL + token);

			socketStatus.current.onopen = () => {};

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

			socketStatus.current.onclose = async event => {
				if (event.code === 1006) {
					const newToken = await refreshToken();
					if (newToken) {
						connectWSStatus();
					}
				}
			}
		}

		connectWSStatus();

		return () => {
			if (socketStatus.current && socketStatus.current.readyState === WebSocket.OPEN) {
				socketStatus.current.close();
			}
		};
	}, [setActivity]);

	useEffect(() => {
		pathnameRef.current = location.pathname;
	}, [location.pathname]);

	const contextValue = useMemo(() => ({
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
	}), [relations, friends, requests, blockedUsers, isRefetch]);

	return (
		<RelationContext.Provider value={contextValue}>
			<ChatProvider>
				{ children }
			</ChatProvider>
		</RelationContext.Provider>
	);
};

export const useRelation = () => useContext(RelationContext);

export default RelationProvider;
