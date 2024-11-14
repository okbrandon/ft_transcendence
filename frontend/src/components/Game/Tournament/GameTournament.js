import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import GameProfiles from "../GameProfiles";
import GameScene from "../remote/GameScene";
import { formatUserData } from "../../../api/user";
import { PageContainer } from "../styles/Game.styled";
import { useTournament } from "../../../context/TournamentContext";
import { useAuth } from "../../../context/AuthContext";
import { UpcomingMatches } from "../styles/Tournament/Tournament.styled";
import { useTranslation } from "react-i18next";

const GameTournament = () => {
	const navigate = useNavigate();
	const { resetMatch, setResetMatch } = useTournament();
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
	const playerIdRef = useRef(null);

	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const token = useRef(localStorage.getItem('token'));

	const maxReconnectAttempts = 5;

	const { t } = useTranslation();

	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		onOpen: () => {
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
		} else {
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
		setUpcomingMatches(Object.values(resetMatch.matches).map(match => ({
			currentMatchID: resetMatch.matchID,
			matchID: match.matchID,
			players: match.players.map(formatUserData)
		})));

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
	}, [resetMatch, setResetMatch]);


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
				setActivateTimer(true);
				if (!isSpectatorRef.current) {
					setGameState(prevState => ({ ...prevState, matchState: data.d }));
				}
			},
			'SPECTATE_JOIN': () => {
				setIsSpectator(true);
				setGameState(prevState => ({
					...prevState,
					matchState: data.d.match_state,
					playerSide: 'left',
					player: data.d.playerA ? formatUserData(data.d.playerA) : null,
					opponent: data.d.playerB ? formatUserData(data.d.playerB) : null,
				}));
				if (data.d.match_state.playerA) playerId.current = data.d.match_state.playerA.userID;
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
				setEndGameData({
					...data.d,
					winnerProfile: data.d.winnerProfile ? formatUserData(data.d.winnerProfile) : null,
				});
			},
			'HEARTBEAT_ACK': () => {},
			'BALL_HIT': () => {
				setHitPos(data.d.ball);
				if (hasInteractedRef.current) {
					const hit2 = new Audio('/sounds/pong-hit2.mp3');
					hit2.volume = 0.2;
					hit2.play();
				}
			},
			'PADDLE_RATE_LIMIT': () => {}, // ignoring
			'MATCH_JOIN': () => setGameState(prevState => ({
				...prevState,
				playerSide: data.d.side,
				opponent: data.d.opponent ? formatUserData(data.d.opponent) : null
			})),
			'PLAYER_JOIN': () => {
				if (data.d.userID !== playerIdRef.current)
					setGameState(prevState => ({ ...prevState, opponent: formatUserData(data.d) }));
			},
			'PADDLE_HIT': () => {
				setHitPos(data.d.ball);
				if (hasInteractedRef.current) {
					const hit1 = new Audio('/sounds/pong-hit1.mp3');
					hit1.volume = 0.2;
					hit1.play();
				}
			},
		};

		const handler = handlers[data.e];
		if (handler) {
			handler();
		}
	}, [lastMessage, sendMessage]);

	useEffect(() => {
		isSpectatorRef.current = isSpectator;
	}, [isSpectator]);

	useEffect(() => {
		if (gameState.player?.userID){
			playerIdRef.current = gameState.player.userID;
		}
	}, [gameState.player]);

	useEffect(() => {
		hasInteractedRef.current = hasInteracted;
	}, [hasInteracted]);

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
				isTournament={true}
			/>
			<UpcomingMatches>
				<h3>{t('game.tournaments.gamePage.upcomingMatches.title')}</h3>
				<div className="scrollable">
					{upcomingMatches.map((match, index) => (
						<div key={index} className={`match ${match.currentMatchID === match.matchID && 'current-match'}`}>
							<span className={`player`}>
								{(match.players?.[0] && <span>{match.players?.[0]?.displayName}</span>) || <span className="unkwown">{t('game.tournaments.gamePage.upcomingMatches.noPlayer')}</span>}
								vs
								{(match.players?.[1] && <span>{match.players?.[1]?.displayName}</span>) || <span className="unkwown">{t('game.tournaments.gamePage.upcomingMatches.noPlayer')}</span>}
							</span>
						</div>
					))}
				</div>
			</UpcomingMatches>
		</PageContainer>
	);
};

export default GameTournament;
