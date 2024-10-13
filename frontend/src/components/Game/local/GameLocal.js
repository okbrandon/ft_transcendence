import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameSceneContainer, PageContainer, ProfilesContainer, Score, ScoresContainer, StyledCanvas, Timer, TimerContainer } from "../styles/Game.styled";
import GameCanvas from "../../../scripts/game";
import { useNavigate } from "react-router-dom";

const GameLocal = () => {
	const navigate = useNavigate();
	const [keyPressedA, setKeyPressedA] = useState(null);
	const [keyPressedB, setKeyPressedB] = useState(null);
	const [isHit, setIsHit] = useState(false);
	const [timer, setTimer] = useState(5);

	const [scoreA, setScoreA] = useState(0);
	const [scoreB, setScoreB] = useState(0);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [activateTimer, setActivateTimer] = useState(false);

	const canvas = useRef(null);
	const paddle1 = useRef(null);
	const paddle2 = useRef(null);
	const ball = useRef(null);
	const hit = useRef(null);
	const intervalRef = useRef(null);

	const terrain = useMemo(() => ({
		WIDTH: 1200,
		HEIGHT: 750,
		SCENEWIDTH: 22,
		SCENEHEIGHT: 15,
		SCALEX: 22 / 1200,
		SCALEY: 15 / 750,
	}), []);

	// Ball speed and direction
	const ballVelocity = useRef({ x: 0.01, y: 0.01 });

	// Paddle movement speed
	const paddleSpeed = 0.1;

	// Setting up paddle movement
	const movePaddle = useCallback((direction, paddle) => {
		if (!paddle.current) return;
		if (direction === 'up') {
			paddle.current.position.y = Math.min(terrain.SCENEHEIGHT / 2 - 1.37, paddle.current.position.y + paddleSpeed);
		}
		if (direction === 'down') {
			paddle.current.position.y = Math.max(-terrain.SCENEHEIGHT / 2 + 1.45, paddle.current.position.y - paddleSpeed);
		}
	}, [terrain.SCENEHEIGHT, paddleSpeed]);

	// Keyboard event listeners
	useEffect(() => {
		const handleKeyDown = event => {
			if (!isGameStarted && !activateTimer) {
				setActivateTimer(true);
				return;
			}
			if (event.key === 'ArrowUp') setKeyPressedB('up');
			else if (event.key === 'ArrowDown') setKeyPressedB('down');
			else if (event.key === 'w') setKeyPressedA('up');
			else if (event.key === 's') setKeyPressedA('down');
			else if (event.key === 'q') navigate('/');
		}

		const handleKeyUp = event => {
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') setKeyPressedB(null);
			if (event.key === 'w' || event.key === 's') setKeyPressedA(null);
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		}
	}, [navigate, isGameStarted, activateTimer]);

	// Reset ball to the center after a goal
	const resetBall = useCallback(() => {
		if (ball.current) {
			ball.current.position.set(0, 0, 0);

			// Randomize the ball's direction: 50% chance to go left (-1) or right (1)
			const directionX = Math.random() < 0.5 ? -1 : 1;
			const directionY = Math.random() < 0.5 ? -1 : 1;

			// Set the ball's velocity with random direction on both axes
			ballVelocity.current = {
				x: directionX * 0.1, // Random left (-1) or right (1)
				y: directionY * 0.1  // Random up (-1) or down (1)
			};
		}
	}, []);

	// Ball hit effect
	useEffect(() => {
		if (!isHit) return;
		const timeoutID = setTimeout(() => setIsHit(false), 500);

		return () => clearTimeout(timeoutID);
	}, [isHit]);

	// Ball movement logic and collision detection
	const updateBallPosition = useCallback(() => {
		if (!ball.current || !paddle1.current || !paddle2.current) return;

		ball.current.position.x += ballVelocity.current.x;
		ball.current.position.y += ballVelocity.current.y;

		if (ball.current.position.y > terrain.SCENEHEIGHT / 2 - 0.3 || ball.current.position.y < -terrain.SCENEHEIGHT / 2 + 0.4) {
			ballVelocity.current.y *= -1;
		}

		const paddleHeight = 120 * terrain.SCALEY;
		const paddleWidth = 20 * terrain.SCALEX;
		const ballRadius = 25 * terrain.SCALEX / 2;

		const paddle1Top = paddle1.current.position.y + paddleHeight / 2;
		const paddle1Bottom = paddle1.current.position.y - paddleHeight / 2;

		const paddle2Top = paddle2.current.position.y + paddleHeight / 2;
		const paddle2Bottom = paddle2.current.position.y - paddleHeight / 2;

		if (ball.current.position.x - ballRadius <= paddle1.current.position.x + paddleWidth / 2 &&
			ball.current.position.x - ballRadius >= paddle1.current.position.x - paddleWidth / 2 &&
			ball.current.position.y - ballRadius <= paddle1Top &&
			ball.current.position.y + ballRadius >= paddle1Bottom) {
			ballVelocity.current.x *= -1;
			ballVelocity.current.x *= 1.1;
			ballVelocity.current.y *= 1.1;
			hit.current = { x: ball.current.position.x, y: ball.current.position.y };
			setIsHit(true);
		}

		if (ball.current.position.x + ballRadius >= paddle2.current.position.x - paddleWidth / 2 &&
			ball.current.position.x + ballRadius <= paddle2.current.position.x + paddleWidth / 2 &&
			ball.current.position.y - ballRadius <= paddle2Top &&
			ball.current.position.y + ballRadius >= paddle2Bottom) {
			ballVelocity.current.x *= -1;
			ballVelocity.current.x *= 1.1;
			ballVelocity.current.y *= 1.1;
			hit.current = { x: ball.current.position.x, y: ball.current.position.y };
			setIsHit(true);
		}

		if (ball.current.position.x < -terrain.SCENEWIDTH / 2) {
			setScoreB(prev => prev + 1);
			resetBall();
		}

		if (ball.current.position.x > terrain.SCENEWIDTH / 2) {
			setScoreA(prev => prev + 1);
			resetBall();
		}

		if (scoreA >= 10 || scoreB >= 10) {
			navigate('/');
		}
	}, [terrain, resetBall, scoreA, scoreB, navigate]);

	// Timer logic
	useEffect(() => {
		if (activateTimer && timer > 0) {
			intervalRef.current = setInterval(() => {
				setTimer(prev => prev - 1);
			}, 1000);
		}

		if (timer === 0) {
			setActivateTimer(false);
			clearInterval(intervalRef.current);
			setIsGameStarted(true);
		}
		return () => clearInterval(intervalRef.current);
	}, [activateTimer, timer]);

	// Initialize game canvas
	useEffect(() => {
		if (!canvas.current) return;

		const { renderer, camera, dispose } = GameCanvas(canvas.current, paddle1, paddle2, ball, terrain, hit);

		const handleResize = () => {
			renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
			camera.aspect = terrain.WIDTH / terrain.HEIGHT;
			camera.updateProjectionMatrix();
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			dispose();
		}
	}, [terrain]);

	// Animate ball and game logic
	useEffect(() => {
		let animationFrameId;

		const gameLoop = () => {
			if (isGameStarted) {
				if (keyPressedA) movePaddle(keyPressedA, paddle1);
				if (keyPressedB) movePaddle(keyPressedB, paddle2);
				updateBallPosition();
			}

			animationFrameId = requestAnimationFrame(gameLoop);
		};
		gameLoop();

		return () => cancelAnimationFrame(animationFrameId);
	}, [updateBallPosition, movePaddle, keyPressedA, keyPressedB, isGameStarted]);

	return (
		<PageContainer>
			<ProfilesContainer>
				<p style={{margin: '0 auto'}}>Press <b>Q</b> to quit game</p>
			</ProfilesContainer>
			<GameSceneContainer className={isHit ? "hit" : ""}>
				<StyledCanvas ref={canvas}/>
				<ScoresContainer>
					<Score>{scoreA}</Score>
					<Score>{scoreB}</Score>
				</ScoresContainer>
				{!isGameStarted && !activateTimer && (
					<TimerContainer>
						Press any key to start the game
					</TimerContainer>
				)}
				{activateTimer && (
					<TimerContainer>
						<Timer>{timer}</Timer>
					</TimerContainer>
				)}
			</GameSceneContainer>
		</PageContainer>
	);
};

export default GameLocal;
