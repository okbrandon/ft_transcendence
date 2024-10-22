import React from 'react';
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

	return (
		<WinnerPageContainer>
			<WinnerText>Winner of the tournament is: {winnerID}</WinnerText>
			<WinnerContainer>
				<WinnerImage src='/images/prune.jpg' alt='Winner' />
				<WinnerUsername>Prune</WinnerUsername>
				<WinnerPrize>Display number of coins</WinnerPrize>
			</WinnerContainer>
			<Confetti />
		</WinnerPageContainer>
	);
}

export default WinnerTournament;
