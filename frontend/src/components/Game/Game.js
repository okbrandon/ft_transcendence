import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import GameProfiles from "./GameProfiles";
import GameScene from "./GameScene";
import { formatUserData } from "../../api/user";
import logger from "../../api/logger";
import { PageContainer } from "./styles/Game.styled";

const Game = () => {
	const navigate = useNavigate();
	const [gameState, setGameState] = useState({
		matchState: null,
		player: null,
		opponent: null,
		playerSide: null,
	});

	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [hitPos, setHitPos] = useState(null);

	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const { sendMessage, lastMessage, readyState } = useWebSocket('/ws/match', {
		onClose: event => { if (event.code === 1006) handleReconnect() },
		shouldReconnect: () => true,
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

	const handleIdentify = useCallback(() => {
		sendMessage(JSON.stringify({
			e: 'IDENTIFY',
			d: { token: token.current }
		}));
	}, [sendMessage]);

	const handleHeartbeatAck = useCallback(() => {
		heartbeatAckCount.current += 1;
		if (heartbeatAckCount.current === 2) {
			sendMessage(JSON.stringify({
				e: 'MATCHMAKE_REQUEST',
				d: { match_type: '1v1' }
			}));
		}
	}, [sendMessage]);

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
				case 'MATCH_BEGIN':
				case 'MATCH_UPDATE':
					setGameState(prevState => ({ ...prevState, matchState: data.d }));
					break;
				case 'MATCH_END':
					alert(data.d.won ? 'You won!' : 'You lost!');
					navigate('/');
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
					break;
				default:
					console.log('Unhandled message:', data);
			}
		}
	}, [lastMessage, gameState.player?.userID, handleHeartbeatAck, navigate]);

	return (
		<PageContainer>
			<GameProfiles
				player={gameState.player}
				opponent={gameState.opponent}
				playerSide={gameState.playerSide}
			/>
			<GameScene
				matchState={gameState.matchState}
				hitPos={hitPos}
				sendMessage={sendMessage}
			/>
		</PageContainer>
	)
};

export default Game;
