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
	const [confettiActive, setConfettiActive] = useState(true);

	useEffect(() => {
		// Fade out confetti after 5 seconds
		const timer = setTimeout(() => setConfettiActive(false), 5000);

		// Cleanup timer on component unmount
		return () => clearTimeout(timer);
	}, []);

	return (
		<WinnerPageContainer>
			<WinnerText>Winner of the tournament is: {winnerID}</WinnerText>
			<WinnerContainer>
				<WinnerImage src='/images/prune.jpg' alt='Winner' />
				<WinnerUsername>Prune</WinnerUsername>
				<WinnerPrize>Prize: 42 🪙</WinnerPrize>
			</WinnerContainer>
			{confettiActive && (
				<Confetti
					recycle={false}
					numberOfPieces={300}
					style={{
						opacity: confettiActive ? 1 : 0,
						transition: 'opacity 1s ease-out',
					}}
				/>
			)}
		</WinnerPageContainer>
	);
};

export default WinnerTournament;
