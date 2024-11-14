import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import GameProfiles from "../GameProfiles";
import GameScene from "./GameScene";
import { formatUserData } from "../../../api/user";
import { PageContainer } from "../styles/Game.styled";
import { useAuth } from "../../../context/AuthContext";

const Game = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { hasInteracted } = useAuth();
	const hasInteractedRef = useRef(hasInteracted);
	const [gameState, setGameState] = useState({
		matchState: null,
		player: null,
		opponent: null,
		playerSide: null,
	});
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [endGameData, setEndGameData] = useState(null);

	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [hitPos, setHitPos] = useState(null);
	const [borderScore, setBorderScore] = useState(null);

	const [activateTimer, setActivateTimer] = useState(false);

	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const { sendMessage, lastMessage, readyState } = useWebSocket(process.env.REACT_APP_ENV === 'production' ? '/ws/match' : 'ws://localhost:8000/ws/match', {
		onClose: event => { if (event.code === 1006) handleReconnect() },
		shouldReconnect: () => !gameOver,
	});

	const handleReconnect = useCallback(() => {
		if (reconnectAttempts.current < maxReconnectAttempts) {
			reconnectAttempts.current += 1;
		} else {
			navigate('/');
		}
	}, [navigate]);

	const sendHeartbeat = useCallback(() => {
		sendMessage(JSON.stringify({ e: 'HEARTBEAT' }));
	}, [sendMessage]);

	const handleIdentify = useCallback(() => {
		sendMessage(JSON.stringify({
			e: 'IDENTIFY',
			d: { token: token.current }
		}));
	}, [sendMessage]);

	const retreiveGameMode = useCallback(() => {
		if (location.pathname === '/game-ai') return 'ai';
		if (location.pathname === '/game-classic') return '1v1';
		if (location.pathname === '/game-challenge') return 'challenge';
		return '';
	}, [location.pathname]);

	const handleHeartbeatAck = useCallback(() => {
		heartbeatAckCount.current += 1;
		if (heartbeatAckCount.current === 2) {
			sendMessage(JSON.stringify({
				e: 'MATCHMAKE_REQUEST',
				d: { match_type: retreiveGameMode() }
			}));
		}
	}, [sendMessage, retreiveGameMode]);

	// Send IDENTIFY message on connection open
	useEffect(() => {
		if (readyState === ReadyState.OPEN && heartbeatIntervalTime) {
			reconnectAttempts.current = 0;
			handleIdentify();

			heartbeatInterval.current = setInterval(sendHeartbeat, heartbeatIntervalTime);
		}

		return () => {
			if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
		};
	}, [readyState, heartbeatIntervalTime, handleIdentify, sendHeartbeat]);

	// Handle incoming messages
	useEffect(() => {
		if (lastMessage) {
			const data = JSON.parse(lastMessage.data);
			switch (data.e) {
				case 'HELLO':
					setHeartbeatIntervalTime(data.d.heartbeat_interval);
					break;
				case 'MATCH_READY':
					setActivateTimer(true);
					setGameState(prevState => ({ ...prevState, matchState: data.d }));
					break;
				case 'MATCH_BEGIN':
					setGameStarted(true);
					break;
				case 'MATCH_UPDATE':
					setGameState(prevState => ({ ...prevState, matchState: data.d }));
					break;
				case 'BALL_SCORED':
					setBorderScore(data.d.player);
					break;
				case 'MATCH_END':
					setGameOver(true);
					setEndGameData(data.d);
					break;
				case 'HEARTBEAT_ACK':
					handleHeartbeatAck();
					break;
				case 'READY':
					setGameState(prevState => ({ ...prevState, player: formatUserData(data.d) }));
					break;
				case 'MATCH_JOIN':
					setGameState(prevState => ({
						...prevState,
						playerSide: data.d.side,
						opponent: data.d.opponent ? formatUserData(data.d.opponent) : null
					}));
					break;
				case 'PLAYER_JOIN':
					if (data.d.userID !== gameState.player?.userID) setGameState(prevState => ({ ...prevState, opponent: formatUserData(data.d) }));
					break;
				case 'PADDLE_HIT':
					setHitPos(data.d.ball);
					if (hasInteractedRef.current) {
						const hit1 = new Audio('/sounds/pong-hit1.mp3');
						hit1.volume = 0.2;
						hit1.play();
					}
					break;
				case 'BALL_HIT':
					setHitPos(data.d.ball);
					if (hasInteractedRef.current) {
						const hit2 = new Audio('/sounds/pong-hit2.mp3');
						hit2.volume = 0.2;
						hit2.play();
					}
					break;
				case 'PADDLE_RATE_LIMIT': // ignoring
					break;
				default:
					break;
			}
		}
	}, [lastMessage, gameState.player?.userID, handleHeartbeatAck, navigate]);

	useEffect(() => {
		hasInteractedRef.current = hasInteracted;
	}, [hasInteracted]);

	return (
		<PageContainer>
			<GameProfiles
				player={gameState.player}
				opponent={gameState.opponent}
				playerSide={gameState.playerSide}
			/>
			<GameScene
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
				isTournament={false}
				hasInteracted={hasInteractedRef.current}
			/>
		</PageContainer>
	)
};

export default Game;
