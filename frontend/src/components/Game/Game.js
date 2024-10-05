import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageContainer } from "./styles/Game.styled";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import logger from "../../api/logger";
import GameProfiles from "./GameProfiles";
import GameScene from "./GameScene";

const Test = () => {
	const navigate = useNavigate();
	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);

	const [matchState, setMatchState] = useState(null);
	const [player, setPlayer] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const [playerSide, setPlayerSide] = useState(null);
	const [hitPos, setHitPos] = useState(false);

	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);

	const maxReconnectAttempts = 5;

	const { sendMessage, lastMessage, readyState } = useWebSocket('/ws/match', {
		onClose: event => { if (event.code === 1006) handleReconnect() },
		retryOnError: true,
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

	useEffect(() => {
		if (readyState === ReadyState.OPEN && heartbeatIntervalTime) {
			reconnectAttempts.current = 0;
			sendMessage(JSON.stringify({
				e: 'IDENTIFY',
				d: { token: localStorage.getItem('token') }
			}));
		}
		if (heartbeatIntervalTime) {
			heartbeatInterval.current = setInterval(() => {
				sendMessage(JSON.stringify({ e: 'HEARTBEAT' }));
			}, heartbeatIntervalTime);
		}

		return () => {
			if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
		};
	}, [readyState, heartbeatIntervalTime, sendMessage]);

	useEffect(() => {
		if (lastMessage) {
			const data = JSON.parse(lastMessage.data);
			switch (data.e) {
				case 'HELLO':
					setHeartbeatIntervalTime(data.d.heartbeat_interval);
					break;
				case 'MATCH_BEGIN':
				case 'MATCH_UPDATE':
					setMatchState(data.d);
					break;
				case 'MATCH_END':
					alert(data.d.won ? 'You won!' : 'You lost!');
					navigate('/');
					break;
				case 'HEARTBEAT_ACK':
					heartbeatAckCount.current += 1;
					if (heartbeatAckCount.current === 2) {
						sendMessage(JSON.stringify({
							e: 'MATCHMAKE_REQUEST',
							d: { match_type: '1v1' }
						}));
					}
					break;
				case 'READY':
					setPlayer(data.d);
					break;
				case 'MATCH_JOIN':
					setPlayerSide(data.d.side);
					setOpponent(data.d.opponent);
					break;
				case 'PLAYER_JOIN':
					if (data.d.userID !== player?.userID) setOpponent(data.d);
					break;
				case 'PADDLE_HIT':
					setHitPos(data.d.player.pos);
					break;
				default:
					console.log('Unhandled message:', data);
			}
		}
	}, [lastMessage]);

	return (
		<PageContainer>
			<GameProfiles
				player={player}
				opponent={opponent}
				playerSide={playerSide}
			/>
			<GameScene
				matchState={matchState}
				hitPos={hitPos}
				sendMessage={sendMessage}
			/>
		</PageContainer>
	)
};

export default Test;
