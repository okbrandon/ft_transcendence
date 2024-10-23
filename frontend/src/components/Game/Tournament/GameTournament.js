import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import GameProfiles from "../GameProfiles";
import GameScene from "../remote/GameScene";
import { formatUserData } from "../../../api/user";
import logger from "../../../api/logger";
import { PageContainer } from "../styles/Game.styled";
import { useTonneru } from "../../../context/TonneruContext";

const GameTournament = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const tournamentData = location.state?.tournamentData;
	const { addEventListener } = useTonneru();

	const [gameState, setGameState] = useState({
		matchState: null,
		player: null,
		opponent: null,
		playerSide: null,
	});
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [won, setWon] = useState(false);
	const [upcomingMatches, setUpcomingMatches] = useState([]);

	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [hitPos, setHitPos] = useState(null);
	const [borderScore, setBorderScore] = useState(null);

	const [activateTimer, setActivateTimer] = useState(false);

	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const [socketUrl, setSocketUrl] = useState(null);
	const [currentMatchId, setCurrentMatchId] = useState(null);

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		onClose: event => { 
			if (event.code === 1006 && !gameOver) handleReconnect();
		},
		shouldReconnect: () => !gameOver,
	});

	useEffect(() => {
		setUpcomingMatches(tournamentData.matches);

		const handleTournamentMatchBegin = (data) => {
			const matchUrl = process.env.REACT_APP_ENV === 'production' ? '/ws/match' : 'ws://localhost:8000/ws/match';
			setSocketUrl(`${matchUrl}`);
			setCurrentMatchId(data.d.match_id);
		};

		const unsubscribe = addEventListener('TOURNAMENT_MATCH_BEGIN', handleTournamentMatchBegin);

		return () => {
			unsubscribe();
		};
	}, [addEventListener, tournamentData]);

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
				e: 'TOURNAMENT_MATCH_JOIN',
				d: { "match_id": currentMatchId }
			}));
		}
	}, [sendMessage, currentMatchId]);

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
					setWon(data.d.won);
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
				playerSide={gameState.playerSide}
				hitPos={hitPos}
				borderScore={borderScore}
				sendMessage={sendMessage}
				activateTimer={activateTimer}
				setActivateTimer={setActivateTimer}
				gameStarted={gameStarted}
				gameOver={gameOver}
				won={won}
			/>
			{upcomingMatches.length > 0 && (
				<div>
					<h3>Upcoming Matches:</h3>
					<ul>
						{upcomingMatches.map((match, index) => (
							<li key={index}>
								{match.players[0].username} vs {match.players[1].username}
							</li>
						))}
					</ul>
				</div>
			)}
		</PageContainer>
	)
};

export default GameTournament;