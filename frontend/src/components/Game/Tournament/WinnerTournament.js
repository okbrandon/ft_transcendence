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

const WinnerTournament = ({ winnerID }) => {
	return (
		<WinnerPageContainer>
			<WinnerContainer>
				<WinnerText>Winner of the tournament is: {winnerID}</WinnerText>
				<WinnerImage src='/images/default-profile.png' alt='Winner' />
				<WinnerUsername>Prune</WinnerUsername>
				<WinnerPrize>Display number of coins</WinnerPrize>
			</WinnerContainer>
		</WinnerPageContainer>
  );
}

export default WinnerTournament;
