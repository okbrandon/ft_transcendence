import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { formatUserData } from "../api/user";
import refreshToken from "../api/token";
import { useNotification } from "./NotificationContext";
import { useTranslation } from "react-i18next";

const WS_TOURNAMENT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/tournaments' : 'ws://localhost:8000/ws/tournaments';

export const TournamentContext = createContext({});

const TournamentProvider = ({ children }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { user, setUser } = useAuth();
	const socketTournament = useRef(null);
	const [tournament, setTournament] = useState(null);
	const [endTournamentData, setEndTournamentData] = useState(null);
	const [isStartDisabled, setIsStartDisabled] = useState(true);
	const [resetMatch, setResetMatch] = useState(null);
	const userIDRef = useRef(null);
	const heartbeatIntervalRef = useRef(null);
	const { t } = useTranslation();
	const tRef = useRef(t);

	const sendMessage = useCallback((message) => {
		if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
			socketTournament.current.send(JSON.stringify(message));
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
		setUser(prev => ({
			...prev,
			tournamentID,
		}));
		sendMessage({
			e: 'REGISTER_TOURNAMENT',
			d: { tournamentID }
		});
	}, [sendMessage, setUser]);

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
					participants: [...prevTournament.participants, formatUserData(newUser)]
				};
			});
		} else if (isJoin === false) {
			if (data?.message) {
				setUser(prev => ({
					...prev,
					tournamentID: null,
				}));
				setTournament(null);
				navigate('/tournaments');
			} else {
				setTournament(prevTournament => {
					if (!prevTournament || !data?.user?.userID) {
						return prevTournament;
					}

					return {
						...prevTournament,
						participants: prevTournament.participants.filter(p => p.userID !== data.user.userID)
					}
				});
				if (data?.user?.userID === userIDRef.current) {
					setUser(prev => ({
						...prev,
						tournamentID: null,
					}));
					setTournament(null);
					navigate('/tournaments');
				}
			}
		} else {
			setTournament({
				...data,
				participants: data?.participants.sort((a, b) => {
					if (a.userID === data.owner.userID) return -1;
					if (b.userID === data.owner.userID) return 1;
					return 0;
				}).map(formatUserData),
			});
		}
	}, [navigate, setUser]);

	useEffect(() => {
		userIDRef.current = user?.userID || null;
	}, [user?.userID])

	useEffect(() => {
		if (!tournament) return;
		setIsStartDisabled(tournament.participants.length < tournament.maxParticipants);
	}, [tournament]);

	useEffect(() => {
		const connectWSTournament = async () => {
			if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
				socketTournament.current.close();
			}

			let token = localStorage.getItem('token');
			if (!token) {
				token = await refreshToken();
				if (!token) {
					console.error('Unable to refresh the token. WebSocket connection aborted.');
					return;
				}
			}

			socketTournament.current = new WebSocket(WS_TOURNAMENT_URL);

			socketTournament.current.onopen = () => {
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
						navigate(`/tournaments/${data.d.tournament.tournamentID}/game`);
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
						break;
				}
			};

			socketTournament.current.onerror = (error) => {
				console.error('WebSocket for Tournaments encountered an error:', error);
			};

			socketTournament.current.onclose = async event => {
				if (event.code !== 1006) {
					const newToken = await refreshToken();
					if (newToken) {
						connectWSTournament();
						addNotification('info', tRef.current('game.tournaments.reconnectMessage'));
					}
				}
			};
		};

		connectWSTournament();

		return () => {
			if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
			if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
				socketTournament.current.close();
			}
		};
	}, [identify, heartbeat, navigate, updateTournament, addNotification]);

	return (
		<TournamentContext.Provider value={{
			registerForTournament,
			tournament,
			setTournament,
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
