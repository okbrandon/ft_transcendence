import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PageContainer, Profile, ProfileImage, ProfileName, ProfilesContainer, StyledCanvas } from "./styles/Game.styled";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import logger from "../../api/logger";
import GameScene from "./GameScene/GameScene";

const Test = () => {
	const navigate = useNavigate();
	const [matchState, setMatchState] = useState(null);							// Tracks the state of the game (paddle/ball positions)
	const [player, setPlayer] = useState(null);									// Player details (side and avatar)
	const [opponent, setOpponent] = useState(null);								// Opponent details
	const [playerSide, setPlayerSide] = useState(null);							// Tracks which side the player is on (left or right)
	const [matchBegun, setMatchBegun] = useState(false);						// Match state
	const [heartbeatIntervalTime, setHeartbeatIntervalTime] = useState(null);
	const [matchmakingStarted, setMatchmakingStarted] = useState(false);
	const [keyPressed, setKeyPressed] = useState(null);
	const heartbeatAckCount = useRef(0);
	const heartbeatInterval = useRef(null);
	const reconnectAttempts = useRef(0);
	const paddle1 = useRef(null);
	const paddle2 = useRef(null);
	const ball = useRef(null);
	const canvas = useRef(null);
	const maxReconnectAttempts = 5;
	const hit = useRef(null);
	const terrain = useMemo(() => ({
		WIDTH: 1200,
		HEIGHT: 750,
		SCENEWIDTH: 22,
		SCENEHEIGHT: 15,
		SCALEX: 22 / 1200,
		SCALEY: 15 / 750,
	}), []);

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
					heartbeatAckCount.current += 1;
					if (heartbeatAckCount.current >= 2 && !matchmakingStarted) {
						sendMessage(JSON.stringify({
							e: 'MATCHMAKE_REQUEST',
							d: { match_type: '1v1' }
						}));
						setMatchmakingStarted(true);
					}
					break;
				case 'PADDLE_HIT':
					hit.current = {
						x: data.d.player.pos === 'A' ? paddle1.current.position.x : paddle2.current.position.x,
						y: data.d.player.pos === 'A' ? paddle1.current.position.y : paddle2.current.position.y,
					}
					break;
				default:
					console.log('Unhandled event:', data);
			}
		}
	}, [lastMessage]);

	const handlePaddleMove = useCallback(direction => {
		sendMessage(JSON.stringify({
			e: 'PADDLE_MOVE',
			d: { direction }
		}));
	}, [sendMessage]);

	useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === 'ArrowUp') {
                setKeyPressed('up');
            } else if (event.key === 'ArrowDown') {
                setKeyPressed('down');
            } else if (event.key === 'q') {
                sendMessage(JSON.stringify({ e: 'PLAYER_QUIT' }));
                navigate('/');
            }
        };

        const handleKeyup = (event) => {
            if (event.key === 'ArrowUp') {
                if (keyPressed === 'up') {
                    setKeyPressed(null);
                }
            } else if (event.key === 'ArrowDown') {
                if (keyPressed === 'down') {
                    setKeyPressed(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('keyup', handleKeyup);
        };
    }, [keyPressed, navigate, sendMessage]);

    useEffect(() => {
        if (keyPressed) {
            if (keyPressed === 'up') {
                handlePaddleMove('up');
            } else if (keyPressed === 'down') {
				handlePaddleMove('down');
            }
        }
    }, [matchState, handlePaddleMove, keyPressed]);

	// Game scene
	useEffect(() => {
		if (!canvas.current) return;
		const {renderer, camera} = GameScene(
			canvas.current,
			paddle1,
			paddle2,
			ball,
			terrain,
			hit,
		);

		const handleResize = () => {
			renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
			camera.aspect = terrain.WIDTH / terrain.HEIGHT;
			camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			renderer.dispose();
		}
	}, [terrain]);

	useEffect(() => {
		if (matchState) {
			// Adjust paddle positions to center at 0
			paddle1.current.position.y = (matchState.playerA.paddle_y - 375) * terrain.SCALEY;
			paddle2.current.position.y = (matchState.playerB.paddle_y - 375) * terrain.SCALEY;

			// Adjust ball position to center at 0
			ball.current.position.set(
				(matchState.ball.x - 600) * terrain.SCALEX,
				(matchState.ball.y - 375) * terrain.SCALEY,
				0
			);
		}
	}, [matchState, terrain]);

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
			<StyledCanvas ref={canvas}/>
		</PageContainer>
	)
};

export default Test;
