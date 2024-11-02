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
	const { resetMatch, setResetMatch } = useTournament();

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
	const [key, setKey] = useState(0);
	const [isSpectator, setIsSpectator] = useState(false);

	const currentMatchId = useRef(null);
	const playerId = useRef(null);
	const isSpectatorRef = useRef(false);

	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		onOpen: () => {
			console.log("Match WebSocket connection opened");
			reconnectAttempts.current = 0;
		},
		onClose: (event) => {
			console.log("Match WebSocket connection closed");
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

	// Reset tournament
	useEffect(() => {
		if (!resetMatch) return;
		const matchUrl = process.env.REACT_APP_ENV === 'production' ? '/ws/match' : 'ws://localhost:8000/ws/match';

		setSocketUrl(`${matchUrl}?t=${Date.now()}`);
		currentMatchId.current = resetMatch.matchID;

		setGameStarted(false);
		setEndGameData(null);
		setHitPos(null);
		setBorderScore(null);
		setActivateTimer(false);
		setGameOver(false);
		setIsSpectator(false);

		const [playerA, playerB] = resetMatch.players;
		setGameState(prevState => ({
			...prevState,
			matchState: null,
			player: formatUserData(playerA),
			opponent: formatUserData(playerB),
			playerSide: 'left', // Assuming playerA is always on the left
		}))
		playerId.current = playerA.userID;
		setKey(prevKey => prevKey + 1);
		setResetMatch(null);
		console.log('GameTournament.js: match resseted');
	}, [resetMatch, setResetMatch]);

	useEffect(() => {
		setUpcomingMatches(tournamentData.matches);
	}, [tournamentData]);

	useEffect(() => {
		if (readyState === ReadyState.OPEN && heartbeatIntervalTime) {
			heartbeatInterval.current = setInterval(sendHeartbeat, heartbeatIntervalTime);
		}
		return () => {
			if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
		};
	}, [readyState, heartbeatIntervalTime, sendHeartbeat]);

	// Match event listeners
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
				setGameState(prevState => ({ ...prevState, player: formatUserData(data.d) }));
				playerId.current = data.d.userID;
				if (currentMatchId.current) {
					sendMessage(JSON.stringify({
						e: 'TOURNAMENT_MATCH_JOIN',
						d: { "match_id": currentMatchId.current }
					}));
				}
			},
			'MATCH_READY': () => {
				if (!isSpectatorRef.current) {
					setActivateTimer(true);
					setGameState(prevState => ({ ...prevState, matchState: data.d }));
				}
			},
			'SPECTATE_JOIN': () => {
				setIsSpectator(true);
				setGameState(prevState => ({
					...prevState,
					matchState: data.d.match_state,
					playerSide: 'left',
					player: data.d.match_state.playerA ? formatUserData(data.d.match_state.playerA) : null,
					opponent: data.d.match_state.playerB ? formatUserData(data.d.match_state.playerB) : null,
				}));
				if (data.d.match_state.playerA) playerId.current = data.d.match_state.playerA.userID;
				setGameStarted(true);
			},
			'MATCH_BEGIN': () => setGameStarted(true),
			'MATCH_UPDATE': () => setGameState(prevState => ({ ...prevState, matchState: data.d })),
			'BALL_SCORED': () => setBorderScore(data.d.player),
			'MATCH_END': () => {
				setGameOver(true);
				setEndGameData(data.d);
			},
			'HEARTBEAT_ACK': () => {},
			'BALL_HIT': () => setHitPos(data.d.ball),
			'PADDLE_RATE_LIMIT': () => {}, // ignoring
			'MATCH_JOIN': () => setGameState(prevState => ({
				...prevState,
				playerSide: data.d.side,
				opponent: data.d.opponent ? formatUserData(data.d.opponent) : null
			})),
			'PLAYER_JOIN': () => {
				if (data.d.userID !== playerId.current)
					setGameState(prevState => ({ ...prevState, opponent: formatUserData(data.d) }));
			},
			'PADDLE_HIT': () => setHitPos(data.d.ball),
		};

		const handler = handlers[data.e];
		if (handler) {
			handler();
		} else {
			console.log('GameTournament.js: Unhandled message:', data);
		}
	}, [lastMessage, sendMessage]);

	useEffect(() => {
		isSpectatorRef.current = isSpectator;
	}, [isSpectator]);

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
