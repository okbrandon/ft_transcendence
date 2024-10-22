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
		const timer = setTimeout(() => {
			setConfettiOpacity(0);
			setTimeout(() => setShowConfetti(false), 1000); // Wait for the fade-out to complete
		}, 5000);

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
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
}

export default WinnerTournament;
