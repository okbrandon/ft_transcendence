import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameSceneContainer, Score, ScoresContainer, StyledCanvas, Timer, OverlayContainer } from "../styles/Game.styled";
import gameCanvas from "../../../scripts/game";
import { getSkin } from "../../../api/user";
import { lerp } from "../../../scripts/math";
import Rewards from "./Rewards";

const GameScene = ({ player, opponent, matchState, playerSide, hitPos, borderScore, sendMessage, activateTimer, setActivateTimer, gameStarted, gameOver, endGameData, isSpectator, isTournament, hasInteracted }) => {
	const navigate = useNavigate();

	const [borderColor, setBorderColor] = useState(null);
	const [timer, setTimer] = useState(5);
	const [isHit, setIsHit] = useState(false);

	const keyPressed = useRef({ up: false, down: false });

	const [scoreA, setScoreA] = useState(0);
	const [scoreB, setScoreB] = useState(0);

	const canvas = useRef(null);
	const paddle1 = useRef(null);
	const [skin1, setSkin1] = useState(null);
	const paddle2 = useRef(null);
	const [skin2, setSkin2] = useState(null);
	const ball = useRef(null);
	const hit = useRef(null);
	const intervalRef = useRef(null); // Store interval reference

	const ballPosition = useRef({ x: 0, y: 0 });
	const ballVelocity = useRef({ dx: 0, dy: 0 });
	const lastUpdateTime = useRef(Date.now());
	const targetBallPosition = useRef({ x: 0, y: 0 });
	const lastBallScored = useRef(Date.now());

	const terrain = useMemo(() => ({
		WIDTH: 1200,
		HEIGHT: 750,
		SCENEWIDTH: 22,
		SCENEHEIGHT: 15,
		SCALEX: 22 / 1200,
		SCALEY: 15 / 750,
	}), []);

	useEffect(() => {
		if (player && playerSide) {
			getSkin(player.userID)
				.then(skin => {
					if (playerSide === 'left' && !skin1) {
						setSkin1(skin);
					} else if (playerSide === 'right' && !skin2) {
						setSkin2(skin);
					}
				});
		}
		if (opponent && playerSide) {
			getSkin(opponent.userID)
				.then(skin => {
					if (playerSide === 'left' && !skin2) {
						setSkin2(skin);
					} else if (playerSide === 'right' && !skin1) {
						setSkin1(skin);
					}
				})
		}
	}, [player, opponent, playerSide, skin1, skin2]);

	useEffect(() => {
		if (activateTimer && timer > 0) {
			intervalRef.current = setInterval(() => {
				setTimer(prev => prev - 1);
			}, 1000);
		}

		if (timer === 0) {
			setActivateTimer(false);
			clearInterval(intervalRef.current);
		}

		return () => clearInterval(intervalRef.current);
	}, [activateTimer, timer, setActivateTimer]);

	const handlePaddleMove = useCallback(direction => {
		if (isSpectator) return;
		if (direction.up) {
			sendMessage(JSON.stringify({
				e: 'PADDLE_MOVE',
				d: { direction: 'up' }
			}));
		}
		if (direction.down) {
			sendMessage(JSON.stringify({
				e: 'PADDLE_MOVE',
				d: { direction: 'down' }
			}));
		}
	}, [sendMessage, isSpectator]);

	useEffect(() => {
		if (isSpectator) return;

		const handleKeydown = event => {
			if (event.key === 'ArrowUp') keyPressed.current.up = true;
			else if (event.key === 'ArrowDown') keyPressed.current.down = true;
			if (event.key === 'q') {
				sendMessage(JSON.stringify({ e: 'PLAYER_QUIT' }));
				navigate('/playmenu');
			}
		};

		const handleKeyup = event => {
			if (event.key === 'ArrowUp') keyPressed.current.up = false;
			if (event.key === 'ArrowDown') keyPressed.current.down = false;
		};

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyup);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	}, [navigate, sendMessage, isSpectator]);

	useEffect(() => {
		if (!keyPressed || isSpectator) return;
		let animationFrameId;

		const move = () => {
			if (gameStarted && !gameOver) {
				if (keyPressed.current.up || keyPressed.current.down) {
					handlePaddleMove(keyPressed.current);
				}
			}
			animationFrameId = requestAnimationFrame(move);
		};
		move();

		return () => cancelAnimationFrame(animationFrameId);
	}, [keyPressed, handlePaddleMove, gameStarted, gameOver, isSpectator]);

	useEffect(() => {
		if (!hitPos) return;
		hit.current = { x: (hitPos.x - 600) * terrain.SCALEX, y: (hitPos.y - 375) * terrain.SCALEY };
		setIsHit(true);
		const timeoutID = setTimeout(() => setIsHit(false), 500);
		return () => clearTimeout(timeoutID);
	}, [hitPos, terrain]);

	useEffect(() => {
		if (!borderScore) return;
		const side = borderScore.pos === 'A' ? 'left' : 'right';
		if (side === playerSide) {
			setBorderColor('green')
			if (hasInteracted) {
				const wonSound = new Audio('/sounds/pong-won.mp3');
				wonSound.volume = 0.2;
				wonSound.play();
			}
		} else {
			setBorderColor('red');
			if (hasInteracted) {
				const lostSound = new Audio('/sounds/pong-lost.mp3');
				lostSound.volume = 0.2;
				lostSound.play();
			}
		}
		const timeoutID = setTimeout(() => setBorderColor(null), 500);
		return () => clearTimeout(timeoutID);
	}, [borderScore, playerSide, hasInteracted]);

	useEffect(() => {
		if (!canvas.current) return;

		const { renderer, camera, dispose } = gameCanvas(canvas.current, paddle1, paddle2, skin1, skin2, ball, terrain, hit);

		const handleResize = () => {
			renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
			camera.aspect = terrain.WIDTH / terrain.HEIGHT;
			camera.updateProjectionMatrix();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			dispose();
		}
	}, [terrain, skin1, skin2, ball]);

	useEffect(() => {
		if (!matchState) return;
		if (matchState.scores[`${matchState.playerA.id}`] !== scoreA) {
			setScoreA(matchState.scores[`${matchState.playerA.id}`]);
			lastBallScored.current = Date.now();
		}
		if (matchState.scores[`${matchState.playerB.id}`] !== scoreB) {
			setScoreB(matchState.scores[`${matchState.playerB.id}`]);
			lastBallScored.current = Date.now();
		}
	}, [matchState, scoreA, scoreB]);

	useEffect(() => {
		if (!matchState) return;

		paddle1.current.position.y = (matchState.playerA.paddle_y - 375) * terrain.SCALEY;
		paddle2.current.position.y = (matchState.playerB.paddle_y - 375) * terrain.SCALEY;

		targetBallPosition.current = {
			x: (matchState.ball.x - 600) * terrain.SCALEX,
			y: (matchState.ball.y - 375) * terrain.SCALEY,
		};
		ballVelocity.current = {
			dx: matchState.ball.dx * terrain.SCALEX,
			dy: matchState.ball.dy * terrain.SCALEY,
		};
		lastUpdateTime.current = Date.now();
	}, [terrain, matchState]);

	useEffect(() => {
		let animationFrameId;

		const updateBallPosition = () => {
			const currentTime = Date.now();
			let deltaTime = (currentTime - lastUpdateTime.current) / 1000;

			if (!gameStarted || gameOver)
				return;

			if (deltaTime > 0.016)
				deltaTime = 0.016;

			lastUpdateTime.current = currentTime;

			const predictedX = ballPosition.current.x + ballVelocity.current.dx * deltaTime;
			const predictedY = ballPosition.current.y + ballVelocity.current.dy * deltaTime;

			const newX = lerp(predictedX, targetBallPosition.current.x, 0.4);
			const newY = lerp(predictedY, targetBallPosition.current.y, 0.4);

			ballPosition.current.x = newX;
			ballPosition.current.y = newY;
			ball.current.position.set(newX, newY, 0);

			animationFrameId = requestAnimationFrame(updateBallPosition);
		};

		animationFrameId = requestAnimationFrame(updateBallPosition);

		return () => cancelAnimationFrame(animationFrameId);
	}, [ballPosition, ballVelocity, gameStarted, gameOver]);

	return (
		<GameSceneContainer className={`${isHit ? "hit" : ""} ${borderColor}`} key={gameOver ? 'game-over' : 'game-active'}>
			<StyledCanvas ref={canvas}/>
			<ScoresContainer>
				<Score>{scoreA}</Score>
				<Score>{scoreB}</Score>
			</ScoresContainer>
				{gameOver ? (
					<Rewards endGameData={endGameData} isSpectator={isSpectator} isTournament={isTournament}/>
				) : (
					<>
						{activateTimer && (
							<OverlayContainer>
								<Timer>{timer}</Timer>
							</OverlayContainer>
						)}
					</>
				)}
		</GameSceneContainer>
	);
};

export default GameScene;
