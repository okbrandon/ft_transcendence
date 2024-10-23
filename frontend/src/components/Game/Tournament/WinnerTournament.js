import React, { useState, useEffect } from 'react';
import {
	WinnerPageContainer,
	WinnerContainer,
	WinnerText,
	WinnerImage,
	WinnerUsername,
	WinnerPrize,
	TrophyIcon,
	WinnerBio,
	TimerText,
} from '../styles/Tournament/WinnerTournament.styled';
import { useNotification } from '../../../context/NotificationContext';
import Confetti from 'react-confetti';
import ShareButton from './ShareButton';

const WinnerTournament = ({ winnerID }) => {
	const [confettiActive, setConfettiActive] = useState(true);
	const [timeLeft, setTimeLeft] = useState(900);
	const { addNotification } = useNotification();
	const testWins = 20;

	useEffect(() => {
		const confettiTimer = setTimeout(() => setConfettiActive(false), 5000);
		return () => clearTimeout(confettiTimer);
	}, []);

	// Countdown Timer for redirecting to home page
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		if (timeLeft === 0) {
			window.location.href = '/';
		}

		return () => clearInterval(timer);
	}, [timeLeft]);

	const getWinnerMessage = (wins) => {
		if (wins > 10) {
			return `Wow, Prune! You're a legend with ${wins} wins!`;
		} else if (wins > 5) {
			return `Great job, Prune! You've won ${wins} tournaments!`;
		} else {
			return `Congrats Prune! You're off to a strong start with ${wins} wins!`;
		}
	};

	return (
		<WinnerPageContainer>
			<WinnerText>You're the winner!</WinnerText>
			<TimerText>Redirecting you to home page in {timeLeft} seconds...</TimerText>

			<WinnerContainer>
				<TrophyIcon className='bi bi-trophy-fill'></TrophyIcon>
				<WinnerImage src='/images/prune.jpg' alt='Winner' />
				<WinnerUsername>Prune</WinnerUsername>
				<WinnerPrize>Prize: 42 🪙</WinnerPrize>

				<WinnerBio>{getWinnerMessage(testWins)}</WinnerBio>

				<ShareButton />
			</WinnerContainer>

			{confettiActive && (
				<Confetti recycle={false} numberOfPieces={300} />
			)}
		</WinnerPageContainer>
	);
};

export default WinnerTournament;
