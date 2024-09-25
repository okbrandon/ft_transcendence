import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Game = () => {
	const navigate = useNavigate();
	const [leftBarPressed, setLeftBarPressed] = useState({up: false, down: false});
	const [rightBarPressed, setRightBarPressed] = useState({up: false, down: false});
	const [leftPaddleTop, setLeftBarTop] = useState(247);
	const [rightPaddleTop, setRightBarTop] = useState(247);
	const [ballX, setBallX] = useState(650);
	const [ballY, setBallY] = useState(400);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);

	useEffect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'w') {
				setLeftBarPressed((prevLeftBarPressed) => ({...prevLeftBarPressed, up: true}));
			} else if (event.key === 's') {
				setLeftBarPressed((prevLeftBarPressed) => ({...prevLeftBarPressed, down: true}));
			} else if (event.key === 'ArrowUp') {
				setRightBarPressed((prevRightBarPressed) => ({...prevRightBarPressed, up: true}));
			} else if (event.key === 'ArrowDown') {
				setRightBarPressed((prevRightBarPressed) => ({...prevRightBarPressed, down: true}));
			} else if (event.key === 'q') {
				navigate(-1);
			}
		};

		const handleKeyup = (event) => {
			if (event.key === 'w') {
				setLeftBarPressed((prevLeftBarPressed) => ({...prevLeftBarPressed, up: false}));
			} else if (event.key === 's') {
				setLeftBarPressed((prevLeftBarPressed) => ({...prevLeftBarPressed, down: false}));
			} else if (event.key === 'ArrowUp') {
				setRightBarPressed((prevRightBarPressed) => ({...prevRightBarPressed, up: false}));
			} else if (event.key === 'ArrowDown') {
				setRightBarPressed((prevRightBarPressed) => ({...prevRightBarPressed, down: false}));
			}
		};

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyup);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	}, [navigate]);

	useEffect(() => {
		if (leftBarPressed.up) {
			setLeftBarTop((prevLeftBarTop) => Math.max(0, prevLeftBarTop - 10));
		}
		if (leftBarPressed.down) {
			setLeftBarTop((prevLeftBarTop) => Math.min(494, prevLeftBarTop + 10));
		}
	}, [leftBarPressed]);

	useEffect(() => {
		if (rightBarPressed.up) {
			setRightBarTop((prevLeftBarTop) => Math.max(0, prevLeftBarTop - 10));
		}
		if (rightBarPressed.down) {
			setRightBarTop((prevLeftBarTop) => Math.min(494, prevLeftBarTop + 10));
		}
	}, [rightBarPressed]);

	return (
		<PageContainer>
			<ProfilesContainer>
				<Profile>
					<ProfileImage src='/images/default-profile.png' alt='Profile Picture'/>
					<ProfileName>Player 1</ProfileName>
				</Profile>
				<p>Press <b>Q</b> to quit game</p>
				<Profile>
					<ProfileImage src='/images/default-profile.png' alt='Profile Picture'/>
					<ProfileName>Player 2</ProfileName>
				</Profile>
			</ProfilesContainer>
			<GameContainer>
				<ScoreContainer>
					<Score>{leftScore}</Score>
					<Score>{rightScore}</Score>
				</ScoreContainer>
				<PongPaddle $side="left" $leftPaddleTop={leftPaddleTop} />
				<PongPaddle $side="right" $rightPaddleTop={rightPaddleTop} />
				<PongBall x={ballX} y={ballY} />
				<GameSeparator />
			</GameContainer>
		</PageContainer>
	);
};

export default Game;
