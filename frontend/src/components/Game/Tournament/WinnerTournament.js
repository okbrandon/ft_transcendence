import React, { useState, useEffect } from 'react';
import {
	WinnerPageContainer,
	WinnerContainer,
	WinnerText,
	WinnerImage,
	WinnerUsername,
	WinnerPrize,
} from '../styles/Tournament/WinnerTournament.styled';
import Confetti from 'react-confetti';

const WinnerTournament = ({ winnerID }) => {
	const [showConfetti, setShowConfetti] = useState(true);
	const [confettiOpacity, setConfettiOpacity] = useState(1);

	useEffect(() => {
		const fadeOutTimer = setTimeout(() => {
			setConfettiOpacity(0);
			const stopConfettiTimer = setTimeout(() => setShowConfetti(false), 1000);
			return () => clearTimeout(stopConfettiTimer);
		}, 5000);

		return () => clearTimeout(fadeOutTimer);
	}, []);

	return (
		<WinnerPageContainer>
			<WinnerText>Winner of the tournament is: {winnerID}</WinnerText>
			<WinnerContainer>
				<WinnerImage src='/images/prune.jpg' alt='Winner' />
				<WinnerUsername>Prune</WinnerUsername>
				<WinnerPrize>Prize: 42 🪙</WinnerPrize>
			</WinnerContainer>
			{showConfetti && (
				<Confetti
					style={{
						opacity: confettiOpacity,
						transition: 'opacity 1s ease-out',
					}}
				/>
			)}
		</WinnerPageContainer>
	);
};

export default WinnerTournament;
