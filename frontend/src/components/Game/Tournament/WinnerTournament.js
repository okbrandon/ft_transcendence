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
				<WinnerText style={animations}>Winner of the tournament is: {winnerID}</WinnerText>
				<WinnerImage style={animations} src='/images/default-profile.png' alt='Winner' />
				<WinnerUsername style={animations}>Prune</WinnerUsername>
				<WinnerPrize style={animations}>Display number of coins</WinnerPrize>
			</WinnerContainer>
			<Confetti />
		</WinnerPageContainer>
	);
}

export default WinnerTournament;
