import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameContainer, Score, ScoresContainer, StyledCanvas } from "./styles/Game.styled";
import GameCanvas from "../../scripts/game";
import { useNavigate } from "react-router-dom";

const GameScene = ({ matchState, hitPos, sendMessage }) => {
	const navigate = useNavigate();
	const [keyPressed, setKeyPressed] = useState(null);
	const [scoreA, setScoreA] = useState(0);
	const [scoreB, setScoreB] = useState(0);
	const canvas = useRef(null);
	const paddle1 = useRef(null);
	const paddle2 = useRef(null);
	const ball = useRef(null);
	const hit = useRef(null);

	const terrain = useMemo(() => ({
		WIDTH: 1200,
		HEIGHT: 750,
		SCENEWIDTH: 22,
		SCENEHEIGHT: 15,
		SCALEX: 22 / 1200,
		SCALEY: 15 / 750,
	}), []);

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
			handlePaddleMove(keyPressed);
			animationFrameId = requestAnimationFrame(move);
		};
		move();

		return () => cancelAnimationFrame(animationFrameId);
	}, [keyPressed, handlePaddleMove]);

	useEffect(() => {
		if (!hitPos) return;
		hit.current = {
			x: hitPos === 'A' ? paddle1.current.position.x : paddle2.current.position.x,
			y: hitPos === 'A' ? paddle1.current.position.y : paddle2.current.position.y
		}
	}, [hitPos]);

	useEffect(() => {
		if (!canvas.current) return;

		const { renderer, camera, dispose } = GameCanvas(canvas.current, paddle1, paddle2, ball, terrain, hit);

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
	}, [terrain]);

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
		<GameContainer>
			<StyledCanvas ref={canvas}/>
			<ScoresContainer>
				<Score>{scoreA}</Score>
				<Score>{scoreB}</Score>
			</ScoresContainer>
		</GameContainer>
	);
};

export default GameScene;
