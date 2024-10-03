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

	useEffect(() => { // send token to the server to identify the player and start the heartbeat
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

	useEffect(() => { // to not send a message sooner than the connection
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
				case 'HELLO': // server sends HELLO event after client connects
					setHelloReceived(true);
					setHeartbeatIntervalTime(data.d.heartbeat_interval);
					break;
				case 'READY': // server sends READY event after client identifies
					setPlayer(data.d);
					break;
				case 'MATCH_JOIN': // server sends MATCH_JOIN event after client joins a match
					setPlayerSide(data.d.side);
					setOpponent(data.d.opponent);
					break;
				case 'PLAYER_JOIN': // when you are the first player to join a match so you don't have an opponent yet
					if (data.d.userID !== player.userID) {
						setOpponent(data.d);
					}
					break;
				case 'MATCH_BEGIN': // server sends MATCH_BEGIN event when the match starts
					setMatchState(data.d);
					setMatchBegun(true);
					break;
				case 'MATCH_UPDATE': // spams -> paddle position, ball position, scores...
					setMatchState(data.d);
					break;
				case 'MATCH_END': // server sends MATCH_END event when the match ends
					alert(data.d.won ? 'You won!' : 'You lost!');
					navigate('/');
					break;
				case 'HEARTBEAT_ACK': // server sends HEARTBEAT_ACK event in response to HEARTBEAT
					setHeartbeatAckCount(prevCount => prevCount + 1);
					break;
				case 'PADDLE_HIT': // server sends PADDLE_HIT event when the ball hits a paddle
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
