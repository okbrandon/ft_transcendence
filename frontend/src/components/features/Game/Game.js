import React, { useState, useEffect } from 'react';
import GameContainer, { GameSeparator } from '../../styles/layouts/GameContainer.styled';
import PongBall from '../../styles/shared/game/PongBall';
import PongPaddle from '../../styles/shared/game/PongPaddle';
import { TitleGame } from '../../styles/shared/Title.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';

const Game = () => {
	/* ball pos x: 485 y: 285 and paddles from top: 247 */
	const [leftBarPressed, setLeftBarPressed] = useState({up: false, down: false});
	const [rightBarPressed, setRightBarPressed] = useState({up: false, down: false});
	const [leftBarTop, setLeftBarTop] = useState(247);
	const [rightBarTop, setRightBarTop] = useState(247);

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
	}, []);

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
		<>
			<TitleGame>PONG</TitleGame>
			<BackButton to='/home/game' hoverColor='#fff'><i className='bi bi-arrow-left' style={{'font-size': '35px'}}></i></BackButton>
			<GameContainer>
				<PongPaddle side="left" leftBarTop={leftBarTop}/>
				<PongPaddle side="right" rightBarTop={rightBarTop}/>
				<PongBall x={485} y={285}/>
				<GameSeparator/>
			</GameContainer>
		</>
	);
};

export default Game;
