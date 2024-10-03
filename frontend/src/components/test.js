import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PageContainer, Profile, ProfileImage, ProfileName, ProfilesContainer, StyledCanvas } from "./Game/styles/Game.styled";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import logger from "../api/logger";

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
	const maxReconnectAttempts = 5;
	const terrainWidth = 1200;
	const terrainHeight = 750;
	const sceneWidth = 22;
	const sceneHeight = 15;
	const scaleX = sceneWidth / terrainWidth;
	const scaleY = sceneHeight / terrainHeight;

	const { sendMessage, lastMessage, readyState } = useWebSocket('/ws/match', {
		onClose: event => {
			if (event.code === 1006) {
				handleReconnect();
			}
		},
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
			if (heartbeatInterval.current) {
				clearInterval(heartbeatInterval.current);
			}
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
					if (data.d.userID !== player?.userID) {
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
					heartbeatAckCount.current += 1;
					if (heartbeatAckCount.current >= 2 && !matchmakingStarted) {
						sendMessage(JSON.stringify({
							e: 'MATCHMAKE_REQUEST',
							d: { match_type: '1v1' }
						}));
						setMatchmakingStarted(true);
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

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, terrainWidth / terrainHeight, 0.1, 1000);
		camera.position.set(0, 0, 13);
		camera.lookAt(0, 0, 0);
		const canvas = document.getElementById("canvas");

		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(terrainWidth, terrainHeight);
		renderer.shadowMap.enabled = true; // Enable shadows for depth effect

		// Increase Ambient light intensity to brighten the entire scene
		const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Bright white ambient light
		scene.add(ambientLight);

		// Add spotlight for directional lighting
		const spotlight = new THREE.SpotLight(0xffa500, 2); // Stronger spotlight with orange tint
		spotlight.position.set(0, 10, 20); // Position it above the scene
		spotlight.castShadow = true;
		scene.add(spotlight);

		// Add a directional light for extra lighting
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // White directional light
		directionalLight.position.set(10, 10, 10); // Light coming from the top-right corner
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		// Paddle geometry and material (rounded rectangles with shadows and gradient effect)
		const roundedRectShape = (width, height, radius) => {
			const shape = new THREE.Shape();
			const w = width / 2;
			const h = height / 2;

			shape.moveTo(-w + radius, -h);
			shape.lineTo(w - radius, -h);
			shape.quadraticCurveTo(w, -h, w, -h + radius);
			shape.lineTo(w, h - radius);
			shape.quadraticCurveTo(w, h, w - radius, h);
			shape.lineTo(-w + radius, h);
			shape.quadraticCurveTo(-w, h, -w, h - radius);
			shape.lineTo(-w, -h + radius);
			shape.quadraticCurveTo(-w, -h, -w + radius, -h);

			return shape;
		};

		const paddleShape = roundedRectShape(20 * scaleX, 120 * scaleY, 0.1 * scaleX);
		const extrudeSettings = { depth: 0.1, bevelEnabled: false };
		const paddleGeometry = new THREE.ExtrudeGeometry(paddleShape, extrudeSettings);

		// Phong material for smooth gradient lighting effects (replacing CSS gradient)
		const paddleMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xaaaaaa,
			shininess: 50,
			emissive: 0x333333, // Simulating soft glow from the shadow
		});

		paddle1.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
		paddle1.current.position.set(-11, 0, 0);
		paddle1.current.castShadow = true; // Enable shadows
		scene.add(paddle1.current);

		paddle2.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
		paddle2.current.position.set(11, 0, 0);
		paddle2.current.castShadow = true; // Enable shadows
		scene.add(paddle2.current);

		// Ball geometry (smooth and spherical with glowing effect)
		const ballGeometry = new THREE.SphereGeometry(25 * scaleX / 2, 32, 32);
		const ballMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff, // White ball with gradient glow effect
			specular: 0xffffff,
			shininess: 100, // High shininess for the glow effect
			emissive: 0x555555, // Subtle glow
		});

		ball.current = new THREE.Mesh(ballGeometry, ballMaterial);
		ball.current.position.set(0, 0, 0);
		ball.current.castShadow = true; // Enable shadows for the ball
		scene.add(ball.current);

		const floorGeometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight);
		const floorMaterial = new THREE.MeshPhongMaterial({
			color: 0x222222, // Dark grey floor
			specular: 0x555555, // Reflective for lighting
			shininess: 100, // Makes the floor slightly reflective
			side: THREE.DoubleSide // Visible from both sides
		});
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.receiveShadow = true; // Make the floor receive shadows
		floor.rotation.x = Math.PI / 2; // Rotate the floor to be horizontal
		floor.position.y = -terrainHeight / 2 + 2; // Position the floor slightly below the paddles and ball
		scene.add(floor);

		// Animate the scene and update paddle and ball positions
		const animate = () => {
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};
		animate();

		const handleResize = () => {
			renderer.setSize(terrainWidth, terrainHeight);
			camera.aspect = terrainWidth / terrainHeight;
			camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			renderer.dispose();
		}
	}, []);

	useEffect(() => {
		if (matchState) {
			// Adjust paddle positions to center at 0
			paddle1.current.position.y = (matchState.playerA.paddle_y - 375) * scaleY;
			paddle2.current.position.y = (matchState.playerB.paddle_y - 375) * scaleY;

			// Adjust ball position to center at 0
			ball.current.position.set(
				(matchState.ball.x - 600) * scaleX,
				(matchState.ball.y - 375) * scaleY,
				0
			);
		}
	}, [matchState, scaleX, scaleY]);

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
			<StyledCanvas id="canvas"/>
		</PageContainer>
	)
};

export default Test;
