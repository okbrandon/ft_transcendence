import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import logger from '../api/logger';

const WS_GAME_URL = 'ws://localhost:8888/ws/game/';

export const GameContext = createContext();

const GameProvider = ({ children }) => {
	const authContext = useContext(AuthContext);
	const user = authContext ? authContext.user : null;
	const [gameState, setGameState] = useState(null);
	const [playerSide, setPlayerSide] = useState(null);
	const [player, setPlayer] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const [countdown, setCountdown] = useState(null);
	const socketGame = useRef(null);

	const connectToGame = useCallback((gameToken) => {
		if (socketGame.current) {
			socketGame.current.close();
		}

		socketGame.current = new WebSocket(`${WS_GAME_URL}${gameToken}/`);

		socketGame.current.onopen = () => {
			logger('WebSocket for Game connection opened');
		};

		socketGame.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.e) {
				case 'HEARTBEAT_INTERVAL':
					setHeartbeatInterval(data.d.interval);
					break;
				case 'PLAYER_JOIN':
					const { user, side } = data.d;
					if (user.id === localStorage.getItem('userID')) {
						setPlayerSide(side);
						setPlayer(user);
					} else {
						setOpponent(user);
					}
					break;
				case 'GAME_START_SEQUENCE':
					setCountdown(15);
					break;
				case 'GAME_BEGIN':
					setCountdown(null);
					setGameState(data.d);
				case 'GAME_UPDATE':
					setGameState(data.d);
					break;
				case 'GAME_ENDED':
					handleGameEnded(data.d);
					break;
				case 'HEARTBEAT_ACK':
					break;
				default:
					logger(`Unhandled game event: ${data.e}`);
			}
		};

		socketGame.current.onerror = (error) => {
			console.error('WebSocket for Game encountered an error:', error);
		};

		socketGame.current.onclose = () => {
			logger('WebSocket for Game closed');
		};

		return () => {
			if (socketGame.readyState === WebSocket.OPEN) {
				socketGame.close();
			}
		};
	}, []);

	const setHeartbeatInterval = (interval) => {
		if (socketGame.current) {
			setInterval(() => {
				if (socketGame.current.readyState === WebSocket.OPEN) {
					socketGame.current.send(JSON.stringify({ e: 'HEARTBEAT' }));
				}
			}, interval * 1000);
		}
	};

	const handleGameEnded = (data) => {
		setGameState(null);
		setPlayerSide(null);
		setOpponent(null);
		//TODO
	};

	const movePaddle = (direction) => {
		if (socketGame.current && socketGame.current.readyState === WebSocket.OPEN) {
			socketGame.current.send(JSON.stringify({ e: `PADDLE_${direction.toUpperCase()}` }));
		}
	};

	useEffect(() => {
		return () => {
			if (socketGame.current) {
				socketGame.current.close();
			}
		};
	}, []);

	return (
		<GameContext.Provider value={{
			connectToGame,
			gameState,
			playerSide,
			opponent,
			player,
			countdown,
			setCountdown,
			movePaddle
		}}>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
