import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GameContext } from '../../context/GameContext';
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
	const { gameToken } = useParams();
	const navigate = useNavigate();
	const [leftBarPressed, setLeftBarPressed] = useState({up: false, down: false});
	const [rightBarPressed, setRightBarPressed] = useState({up: false, down: false});
	const [leftPaddleTop, setLeftBarTop] = useState(247);
	const [rightPaddleTop, setRightBarTop] = useState(247);
	const [ballX, setBallX] = useState(650);
	const [ballY, setBallY] = useState(400);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const { connectToGame, gameState, playerSide, opponent, player, countdown, setCountdown } = useContext(GameContext);
	const [leftPlayer, setLeftPlayer] = useState(null);
	const [rightPlayer, setRightPlayer] = useState(null);

	useEffect(() => {
		console.log("effect ws");
		let isConnected = false;

		const connectGame = async () => {
			if (!isConnected) {
			await connectToGame(gameToken);
			isConnected = true;
			}
		};

		connectGame();

		return () => {
			isConnected = false;
		};
	}, [connectToGame, gameToken]);

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

	useEffect(() => {
		let timer;
		if (countdown !== null && countdown > 0) {
		  timer = setTimeout(() => {
			setCountdown(prev => prev - 1);
		  }, 1000);
		}
		return () => clearTimeout(timer);
	}, [countdown]);

	useEffect(() => {
		if (playerSide === 'left') {
			setLeftPlayer(player);
			setRightPlayer(opponent);
		} else if (playerSide === 'right') {
			setLeftPlayer(opponent);
			setRightPlayer(player);
		}
	}, [playerSide, opponent]);

    return (
        <PageContainer>
            <ProfilesContainer>
				<Profile>
					{leftPlayer ? (
						<>
							<ProfileImage src='/images/default-profile.png' alt='Profile Picture'/>
							<ProfileName>{leftPlayer.id === localStorage.getItem('userID') ? leftPlayer.username : opponent?.username}</ProfileName>
						</>
					) : (
						<>
							<p>Waiting for player</p>
							<Spinner animation='border'/>
						</>
					)}
				</Profile>
				{countdown !== null ? (
					<p>Game starts in <b>{countdown}</b>s</p>
				) : (
					<p>Press <b>Q</b> to quit game</p>
				)}
				<Profile>
					{rightPlayer ? (
						<>
							<ProfileImage src='/images/default-profile.png' alt='Profile Picture'/>
							<ProfileName>{rightPlayer.id === localStorage.getItem('userID') ? rightPlayer.username : opponent?.username}</ProfileName>
						</>
					) : (
						<>
							<p>Waiting for player</p>
							<Spinner animation='border'/>
						</>
					)}
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
