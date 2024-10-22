import React from 'react';
import {
	WinnerPageContainer,
	WinnerContainer,
	WinnerText,
	WinnerImage,
	WinnerUsername,
	WinnerPrize,
} from './styles/WinnerTournament';
import Confetti from 'react-confetti';
import { useSpring, animated } from 'react-spring';

const WinnerTournament = ({ winnerID }) => {
	const animations = useSpring({
		from: { opacity: 0, transform: 'translateY(-20px)' },
		to: { opacity: 1, transform: 'translateY(0)' },
		config: { duration: 500 },
	});

	const AnimatedWinnerText = animated(WinnerText);
	const AnimatedWinnerImage = animated(WinnerImage);
	const AnimatedWinnerUsername = animated(WinnerUsername);
	const AnimatedWinnerPrize = animated(WinnerPrize);

	return (
		<WinnerPageContainer>
			<WinnerContainer>
				<AnimatedWinnerText style={animations}>Winner of the tournament is: {winnerID}</AnimatedWinnerText>
				<AnimatedWinnerImage style={animations} src='/images/default-profile.png' alt='Winner' />
				<AnimatedWinnerUsername style={animations}>Prune</AnimatedWinnerUsername>
				<AnimatedWinnerPrize style={animations}>Display number of coins</AnimatedWinnerPrize>
			</WinnerContainer>
			<Confetti />
		</WinnerPageContainer>
	);
}

export default WinnerTournament;
