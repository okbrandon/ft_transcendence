import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import logger from '../api/logger';

const WS_GAME_URL = 'ws://localhost:8888/ws/game/';

export const GameContext = createContext();

const GameProvider = ({ children }) => {
	const authContext = useContext(AuthContext);
	const user = authContext ? authContext.user : null;
	const [gameState, setGameState] = useState(null);
	const [playerSide, setPlayerSide] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const socketGame = useRef(null);

	const connectToGame = (gameToken) => {
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
				case 'PLAYER_SIDE':
					setPlayerSide(data.d.side);
					break;
				case 'PLAYER_JOIN':
					if (user && data.d.id !== user.userID) {
						setOpponent(data.d);
					}
					break;
				case 'GAME_UPDATE':
					setGameState(data.d);
					break;
				case 'GAME_ENDED':
					handleGameEnded(data.d);
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
	};

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
			movePaddle
		}}>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
