import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logger from "../api/logger";
import { formatUserData } from "../api/user";

const WS_TOURNAMENT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/tournaments' : 'ws://localhost:8000/ws/tournaments';

export const TournamentContext = createContext({});

const TournamentProvider = ({ children }) => {
	const navigate = useNavigate();
	const socketTournament = useRef(null);
	const [tournament, setTournament] = useState(null);
	const [endTournamentData, setEndTournamentData] = useState(null);
	const [isStartDisabled, setIsStartDisabled] = useState(true);
	const [resetMatch, setResetMatch] = useState(null);
	const reconnectAttempts = useRef(0);
	const heartbeatIntervalRef = useRef(null);
	const maxReconnectAttempts = 5;

	const sendMessage = useCallback((message) => {
		if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
			socketTournament.current.send(JSON.stringify(message));
		} else {
			logger('WebSocket for Tournaments is not open');
		}
	}, []);

	const identify = useCallback(() => {
		sendMessage({
			e: 'IDENTIFY',
			d: { token: localStorage.getItem('token') }
		});
	}, [sendMessage]);

	const heartbeat = useCallback(() => {
		sendMessage({ e: 'HEARTBEAT' });
	}, [sendMessage]);

	const registerForTournament = useCallback((tournamentID) => {
		sendMessage({
			e: 'REGISTER_TOURNAMENT',
			d: { tournamentID }
		});
	}, [sendMessage]);

	const updateTournament = useCallback((data, isJoin = undefined) => {
		if (isJoin) {
			setTournament(prevTournament => {
				if (!prevTournament || !prevTournament.participants || !Array.isArray(prevTournament.participants)) {
					return prevTournament;
				}
				const newUser = data?.user;
				if (!newUser || prevTournament.participants.some(p => p.userID === newUser.userID)) {
					return prevTournament;
				}
				return {
					...prevTournament,
					participants: [...prevTournament.participants, newUser]
				};
			});
		} else if (isJoin === false) {
			setTournament(prevTournament => {
				if (!prevTournament || !data?.user?.userID) {
					return prevTournament;
				}
				const newTournament = {
					...prevTournament,
					participants: prevTournament.participants.filter(p => p.userID !== data.user.userID)
				};
				if (data.user.userID === prevTournament.owner?.userID) {
					navigate(-1);
				}
				return newTournament;
			});
		} else {
			setTournament(data);
		}
		console.log('TournamentContext.js: updateTournament', data);
		console.log('TournamentContext.js: isJoin', isJoin);
		setIsStartDisabled(data?.participants?.length < data?.maxParticipants || true);
	}, [navigate]);

	useEffect(() => {
		const retryConnection = () => {
			if (reconnectAttempts.current < maxReconnectAttempts) {
				reconnectAttempts.current += 1;
				logger(`Attempting to reconnect... (Attempt ${reconnectAttempts.current})`);
				setTimeout(connectWSTournament, 5000 * reconnectAttempts.current);
			} else {
				logger('Max reconnection attempts reached.');
			}
		}

		const connectWSTournament = () => {
			socketTournament.current = new WebSocket(WS_TOURNAMENT_URL);
			socketTournament.current.onopen = () => {
				logger('WebSocket for Chat connection opened');
				reconnectAttempts.current = 0;
				identify();
			};

			socketTournament.current.onmessage = event => {
				const data = JSON.parse(event.data);
				switch (data.e) {
					case 'HELLO':
						const heartbeatInterval = data.d.heartbeat_interval;
						if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
						heartbeatIntervalRef.current = setInterval(heartbeat, heartbeatInterval);
						break;
					case 'TOURNAMENT_READY':
						navigate(`/tournaments/${data.d.tournament.tournamentID}/game`, { state: { tournamentData: data.d } });
						setEndTournamentData(null);
						break;
					case 'TOURNAMENT_JOIN':
						updateTournament(data.d, true);
						break;
					case 'TOURNAMENT_LEAVE':
					case 'TOURNAMENT_KICK':
						updateTournament(data.d, false);
						break;
					case 'TOURNAMENT_MATCH_BEGIN':
						setTimeout(() => {
							setResetMatch(data.d);
						}, 3000);
						break;
					case 'HEARTBEAT_ACK':
					case 'READY':
					case 'TOURNAMENT_REGISTERED':
					case 'CURRENT_TOURNAMENT':
						break;
					case 'TOURNAMENT_END':
						setIsStartDisabled(true);
						setEndTournamentData({
							...data.d,
							winner: formatUserData(data.d.winner)
						});
						navigate(`/tournaments/${data.d.tournamentID}/results`);
						break;
					default:
						console.warn('TournamentContext.js: Unhandled event:', data.e);
				}
			};

			socketTournament.current.onerror = (error) => {
				console.error('WebSocket for Tournaments encountered an error:', error);
				retryConnection();
			};

			socketTournament.current.onclose = () => {
				logger('WebSocket for Tournaments closed');
				retryConnection();
			};
		};

		connectWSTournament();

		return () => {
			if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
			if (socketTournament.current) socketTournament.current.close();
		};
	}, [identify, heartbeat, navigate, updateTournament]);

	return (
		<TournamentContext.Provider value={{
			sendMessage,
			registerForTournament,
			tournament,
			isStartDisabled,
			updateTournament,
			resetMatch,
			setResetMatch,
			endTournamentData,
		}}>
			{children}
		</TournamentContext.Provider>
	);
};

export const useTournament = () => useContext(TournamentContext);

export default TournamentProvider;
