import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import GameProfiles from "../GameProfiles";
import GameScene from "../remote/GameScene";
import { formatUserData } from "../../../api/user";
import logger from "../../../api/logger";
import { PageContainer } from "../styles/Game.styled";
import { useTournament } from "../../../context/TournamentContext";

const GameTournament = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const tournamentData = location.state?.tournamentData;
	const { addEventListener } = useTournament();

	const [gameState, setGameState] = useState({
		matchState: null,
		player: null,
		opponent: null,
		playerSide: null,
	});
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [endGameData, setEndGameData] = useState(null);
	const [upcomingMatches, setUpcomingMatches] = useState([]);
	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [hitPos, setHitPos] = useState(null);
	const [borderScore, setBorderScore] = useState(null);
	const [activateTimer, setActivateTimer] = useState(false);
	const [socketUrl, setSocketUrl] = useState(null);
	const [currentMatchId, setCurrentMatchId] = useState(null);
	const [key, setKey] = useState(0);
	const [isSpectator, setIsSpectator] = useState(false);

	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		onOpen: () => {
			console.log("WebSocket connection opened");
			reconnectAttempts.current = 0;
		},
		onClose: (event) => { 
			if (event.code === 1006 && !gameOver) handleReconnect();
		},
		shouldReconnect: () => !gameOver,
		retryOnError: true,
		reconnectInterval: 3000,
	});

	const handleReconnect = useCallback(() => {
		if (reconnectAttempts.current < maxReconnectAttempts) {
			reconnectAttempts.current += 1;
			logger(`Attempting to reconnect... (Attempt ${reconnectAttempts.current})`);
		} else {
			logger('Max reconnection attempts reached. Redirecting to home.');
			navigate('/');
		}
	}, [navigate]);

	const sendHeartbeat = useCallback(() => {
		sendMessage(JSON.stringify({ e: 'HEARTBEAT' }));
	}, [sendMessage]);

	const handleHeartbeatAck = useCallback(() => {
		heartbeatAckCount.current += 1;
	}, []);

	const resetGameState = useCallback((playerA, playerB) => {
		setGameStarted(false);
		setEndGameData(null);
		setHitPos(null);
		setBorderScore(null);
		setActivateTimer(false);
		setGameOver(false);
		setIsSpectator(false);
		setGameState(prevState => {
			console.log('Resetting game state:');
			console.log('Previous player:', prevState.player);
			console.log('New player:', formatUserData(playerA));
			console.log('Previous opponent:', prevState.opponent);
			console.log('New opponent:', formatUserData(playerB));
			return {
				...prevState,
				matchState: null,
				player: formatUserData(playerA),
				opponent: formatUserData(playerB),
				playerSide: 'left', // Assuming playerA is always on the left
			};
		});
		setKey(prevKey => prevKey + 1);
	}, []);

	const handleTournamentMatchBegin = useCallback((data) => {
		
		console.log("Received TOURNAMENT_MATCH_BEGIN event");			
		const matchUrl = process.env.REACT_APP_ENV === 'production' ? '/ws/match' : 'ws://localhost:8000/ws/match';
		
		setTimeout(() => {
			setSocketUrl(`${matchUrl}?t=${Date.now()}`);
			setCurrentMatchId(data.d.matchID);
			
			const [playerA, playerB] = data.d.players;
			resetGameState(playerA, playerB);
			console.log("done resetting game state");
		}, 3000);
	}, [resetGameState]);

	useEffect(() => {
		setUpcomingMatches(tournamentData.matches);
		const subscribe = addEventListener('TOURNAMENT_MATCH_BEGIN', handleTournamentMatchBegin);
		return () => subscribe();
	}, [addEventListener, tournamentData, handleTournamentMatchBegin]);

	useEffect(() => {
		if (readyState === ReadyState.OPEN && heartbeatIntervalTime) {
			heartbeatInterval.current = setInterval(sendHeartbeat, heartbeatIntervalTime);
		}
		return () => {
			if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
		};
	}, [readyState, heartbeatIntervalTime, sendHeartbeat]);

	useEffect(() => {
		if (!lastMessage) return;

		const data = JSON.parse(lastMessage.data);
		const handlers = {
			'HELLO': () => {
				setHeartbeatIntervalTime(data.d.heartbeat_interval);
				sendMessage(JSON.stringify({
					e: 'IDENTIFY',
					d: { token: token.current }
				}));
			},
			'READY': () => {
				setGameState(prevState => ({ ...prevState }));
				if (currentMatchId) {
					sendMessage(JSON.stringify({
						e: 'TOURNAMENT_MATCH_JOIN',
						d: { "match_id": currentMatchId }
					}));
				}
			},
			'MATCH_READY': () => {
				if (!isSpectator) {
					setActivateTimer(true);
					setGameState(prevState => {
						return {
							...prevState,
							matchState: data.d,
						};
					});
				}
			},
			'SPECTATE_JOIN': () => {
				setIsSpectator(true);
				setGameState(prevState => {
					console.log('SPECTATE_JOIN event:');
					console.log('Previous player:', prevState.player);
					console.log('New player:', data.d.playerA ? formatUserData(data.d.playerA) : null);
					console.log('Previous opponent:', prevState.opponent);
					console.log('New opponent:', data.d.playerB ? formatUserData(data.d.playerB) : null);
					return {
						...prevState,
						matchState: data.d.match_state,
						playerSide: 'left',
						player: data.d.playerA ? formatUserData(data.d.playerA) : null,
						opponent: data.d.playerB ? formatUserData(data.d.playerB) : null,
					};
				});
				setGameStarted(true);
			},
			'MATCH_BEGIN': () => setGameStarted(true),
			'MATCH_UPDATE': () => setGameState(prevState => {
				return {
					...prevState,
					matchState: data.d,
				};
			}),
			'BALL_SCORED': () => setBorderScore(data.d.player),
			'MATCH_END': () => {
				setGameOver(true);
				setEndGameData(data.d);
			},
			'HEARTBEAT_ACK': handleHeartbeatAck,
			'BALL_HIT': () => setHitPos(data.d.ball),
			'PADDLE_RATE_LIMIT': () => {}, // ignoring
			'MATCH_JOIN': () => setGameState(prevState => {
				console.log('MATCH_JOIN event:');
				console.log('Previous opponent:', prevState.opponent);
				console.log('New opponent:', data.d.opponent ? formatUserData(data.d.opponent) : null);
				return {
					...prevState,
					playerSide: data.d.side,
					opponent: data.d.opponent ? formatUserData(data.d.opponent) : null
				};
			}),
			'PADDLE_HIT': () => setHitPos(data.d.ball),
		};

		const handler = handlers[data.e];
		if (handler) {
			handler();
		} else {
			console.log('Unhandled message:', data);
		}
	}, [lastMessage, gameState.player?.userID, handleHeartbeatAck, sendMessage, currentMatchId, isSpectator]);

	return (
		<PageContainer>
			<GameProfiles
				player={gameState.player}
				opponent={gameState.opponent}
				playerSide={gameState.playerSide}
				isSpectator={isSpectator}
			/>
			<GameScene
				key={key}
				player={gameState.player}
				opponent={gameState.opponent}
				matchState={gameState.matchState}
				playerSide={gameState.playerSide}
				hitPos={hitPos}
				borderScore={borderScore}
				sendMessage={sendMessage}
				activateTimer={activateTimer}
				setActivateTimer={setActivateTimer}
				gameStarted={gameStarted}
				gameOver={gameOver}
				endGameData={endGameData}
				isSpectator={isSpectator}
			/>
		</PageContainer>
	);
};

export default GameTournament;