import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
	GameContainer,
	GameSeparator,
	PageContainer,
	PongBall,
	PongPaddle,
	Profile,
	ProfileImage,
	ProfileName,
	ProfilesContainer,
	Score,
	ScoreContainer,
} from './styles/Game.styled';
import Spinner from 'react-bootstrap/Spinner';

const Game = () => {
	const navigate = useNavigate();
	const [matchState, setMatchState] = useState(null);
	const [playerSide, setPlayerSide] = useState(null);
	const [opponent, setOpponent] = useState(null);
	const [player, setPlayer] = useState(null);
	const [matchBegun, setMatchBegun] = useState(false);

	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const maxReconnectAttempts = 5;
	const [helloReceived, setHelloReceived] = useState(false);
	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [heartbeatAckCount, setHeartbeatAckCount] = useState(0);
	const [matchmakingStarted, setMatchmakingStarted] = useState(false);

	const { sendMessage, lastMessage, readyState } = useWebSocket(`/ws/match`, {
		onClose: (event) => {
			if (event.code === 1006) {
				handleReconnect();
			}
		},
		retryOnError: true,
		shouldReconnect: () => true,
	});

	const sendHeartbeat = useCallback(() => {
		sendMessage(JSON.stringify({ e: 'HEARTBEAT' }));
	}, [sendMessage]);

	const handleReconnect = useCallback(() => {
		if (reconnectAttempts.current < maxReconnectAttempts) {
			reconnectAttempts.current += 1;
			console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts.current})`);
		} else {
			console.log('Max reconnection attempts reached. Redirecting to home.');
			navigate('/');
		}
	}, [navigate]);

	useEffect(() => {
		if (readyState === ReadyState.OPEN && helloReceived) {
			reconnectAttempts.current = 0;
			sendMessage(JSON.stringify({
				e: 'IDENTIFY',
				d: { token: localStorage.getItem('token') }
			}));
			if (heartbeatIntervalTime) {
				heartbeatInterval.current = setInterval(() => {
					sendHeartbeat();
				}, heartbeatIntervalTime);
			}
		}

		return () => {
			if (heartbeatInterval.current) {
				clearInterval(heartbeatInterval.current);
			}
		};
	}, [readyState, sendHeartbeat, sendMessage, helloReceived, heartbeatIntervalTime]);

	useEffect(() => {
		if (heartbeatAckCount >= 2 && !matchmakingStarted) {
			sendMessage(JSON.stringify({
				e: 'MATCHMAKE_REQUEST',
				d: { match_type: '1v1' }
			}));
			setMatchmakingStarted(true);
		}
	}, [heartbeatAckCount, matchmakingStarted]);

	useEffect(() => {
		if (lastMessage !== null) {
			const data = JSON.parse(lastMessage.data);
			switch (data.e) {
				case 'HELLO':
					setHelloReceived(true);
					setHeartbeatIntervalTime(data.d.heartbeat_interval);
					break;
				case 'READY':
					setPlayer(data.d);
					break;
				case 'MATCH_JOIN':
					setPlayerSide(data.d.side);
					setOpponent(data.d.opponent);
					break;
				case 'PLAYER_JOIN':
					if (data.d.userID !== player.userID) {
						setOpponent(data.d);
					}
					break;
				case 'MATCH_BEGIN':
					setMatchState(data.d);
					setMatchBegun(true);
					break;
				case 'MATCH_UPDATE':
					setMatchState(data.d);
					break;
				case 'MATCH_END':
					alert(data.d.won ? 'You won!' : 'You lost!');
					navigate('/');
					break;
				case 'HEARTBEAT_ACK':
					setHeartbeatAckCount(prevCount => prevCount + 1);
					break;
				case 'PADDLE_HIT':
					break;
				default:
					console.log('Unhandled event:', data);
			}
		}
	}, [lastMessage]);

	const handlePaddleMove = useCallback((direction) => {
		sendMessage(JSON.stringify({
			e: 'PADDLE_MOVE',
			d: { direction }
		}));
	}, [sendMessage]);

	useEffect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'ArrowUp') {
				handlePaddleMove('up');
			} else if (event.key === 'ArrowDown') {
				handlePaddleMove('down');
			} else if (event.key === 'q') {
				sendMessage(JSON.stringify({ e: 'PLAYER_QUIT' }));
				navigate('/');
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	}, [handlePaddleMove]);

    return (
        <PageContainer>
            <ProfilesContainer>
				<Profile>
					{playerSide === 'left' ? (
						player ? (
							<>
								<ProfileImage src={player.avatarID} alt='Profile Picture'/>
								<ProfileName>{player.username}</ProfileName>
							</>
						) : (
							<>
								<p>Waiting for player</p>
								<Spinner animation='border'/>
							</>
						)
					) : (
						opponent ? (
							<>
								<ProfileImage src={opponent.avatarID} alt='Profile Picture'/>
								<ProfileName>{opponent.username}</ProfileName>
							</>
						) : (
							<>
								<p>Waiting for opponent</p>
								<Spinner animation='border'/>
							</>
						)
					)}
				</Profile>
				<p>Press <b>Q</b> to quit game</p>
				<Profile>
					{playerSide === 'right' ? (
						player ? (
							<>
								<ProfileImage src={player.avatarID} alt='Profile Picture'/>
								<ProfileName>{player.username}</ProfileName>
							</>
						) : (
							<>
								<p>Waiting for player</p>
								<Spinner animation='border'/>
							</>
						)
					) : (
						opponent ? (
							<>
								<ProfileImage src={opponent.avatarID} alt='Profile Picture'/>
								<ProfileName>{opponent.username}</ProfileName>
							</>
						) : (
							<>
								<p>Waiting for opponent</p>
								<Spinner animation='border'/>
							</>
						)
					)}
				</Profile>
			</ProfilesContainer>
			<GameContainer>
				{matchState && (
					<>
						{matchBegun && (
							<ScoreContainer>
								<Score>{matchState.scores[matchState.playerA.id]}</Score>
								<Score>{matchState.scores[matchState.playerB.id]}</Score>
							</ScoreContainer>
						)}
						<PongPaddle $side="left" $leftPaddleTop={matchState.playerA.paddle_y} />
						<PongPaddle $side="right" $rightPaddleTop={matchState.playerB.paddle_y} />
						<PongBall x={matchState.ball.x} y={matchState.ball.y} />
						<GameSeparator />
					</>
				)}
			</GameContainer>
		</PageContainer>
	);
};

export default Game;
