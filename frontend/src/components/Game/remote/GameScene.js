import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameSceneContainer, Score, ScoresContainer, StyledCanvas, Timer, OverlayContainer } from "../styles/Game.styled";
import GameCanvas from "../../../scripts/game";
import PongButton from "../../../styles/shared/PongButton.styled";
import { GetSkin } from "../../../api/user";

const GameScene = ({ player, opponent, matchState, playerSide, hitPos, borderScore, sendMessage, activateTimer, setActivateTimer, gameStarted, gameOver, won }) => {
	const navigate = useNavigate();

	const [keyPressed, setKeyPressed] = useState(null);
	const [isHit, setIsHit] = useState(false);
	const [borderColor, setBorderColor] = useState(null);
	const [timer, setTimer] = useState(5);

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
			GetSkin(player.userID)
				.then(skin => {
					if (playerSide === 'left' && !skin1) {
						setSkin1(skin);
					} else if (playerSide === 'right' && !skin2) {
						setSkin2(skin);
					}
				});
		}
		if (opponent && playerSide) {
			GetSkin(opponent.userID)
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
		if (!direction) return;
		sendMessage(JSON.stringify({
			e: 'PADDLE_MOVE',
			d: { direction }
		}));
	}, [sendMessage]);

	useEffect(() => {
		const handleKeydown = event => {
			if (event.key === 'ArrowUp') setKeyPressed('up');
			else if (event.key === 'ArrowDown') setKeyPressed('down');
			else if (event.key === 'q') {
				sendMessage(JSON.stringify({ e: 'PLAYER_QUIT' }));
				navigate('/');
			}
		};

		const handleKeyup = event => {
			if (event.key === 'ArrowUp' && keyPressed === 'up') setKeyPressed(null);
			if (event.key === 'ArrowDown' && keyPressed === 'down') setKeyPressed(null);
		};

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyup);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	}, [keyPressed, navigate, sendMessage]);

	useEffect(() => {
		if (!keyPressed) return;
		let animationFrameId;

		const move = () => {
			if (gameStarted && !gameOver) {
				handlePaddleMove(keyPressed);
			}
			animationFrameId = requestAnimationFrame(move);
		};
		move();

		return () => cancelAnimationFrame(animationFrameId);
	}, [keyPressed, handlePaddleMove, gameStarted, gameOver]);

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
		if (side === playerSide) setBorderColor('green');
		else setBorderColor('red');
		const timeoutID = setTimeout(() => setBorderColor(null), 500);
		return () => clearTimeout(timeoutID);
	}, [borderScore, playerSide]);

	useEffect(() => {
		if (!canvas.current) return;

		const { renderer, camera, dispose } = GameCanvas(canvas.current, paddle1, paddle2, skin1, skin2, ball, terrain, hit);

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
	}, [terrain, skin1, skin2]);

	useEffect(() => {
		if (!matchState) return;
		if (matchState.scores[`${matchState.playerA.id}`] !== scoreA) setScoreA(matchState.scores[`${matchState.playerA.id}`]);
		if (matchState.scores[`${matchState.playerB.id}`] !== scoreB) setScoreB(matchState.scores[`${matchState.playerB.id}`]);
	}, [matchState, scoreA, scoreB]);

	useEffect(() => {
		if (!matchState) return;

		paddle1.current.position.y = (matchState.playerA.paddle_y - 375) * terrain.SCALEY;
		paddle2.current.position.y = (matchState.playerB.paddle_y - 375) * terrain.SCALEY;

		ball.current.position.set(
			(matchState.ball.x - 600) * terrain.SCALEX,
			(matchState.ball.y - 375) * terrain.SCALEY,
			0
		);
	}, [terrain, matchState]);

	return (
		<GameSceneContainer className={`${isHit ? "hit" : ""} ${borderColor}`}>
			<StyledCanvas ref={canvas}/>
			<ScoresContainer>
				<Score>{scoreA}</Score>
				<Score>{scoreB}</Score>
			</ScoresContainer>
				{gameOver ? (
					<OverlayContainer>
						<h1>Game Over!</h1>
						<p>{won ? 'You won' : 'You lost'}</p>
						<PongButton onClick={() => navigate('/playmenu')}>Go Back to Main Menu</PongButton>
					</OverlayContainer>
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
