import React from 'react';
import styled from 'styled-components';
import PlayerCard from './PlayerCard';
import FilterButton from './tools/FilterButton';
import ScoreTable from './ScoreTable';

// imported styled components
import {
	HeaderContainer,
	WrapContainer,
	MainContainer,
	LeaderboardContainer,
} from './styles/Leaderboard.styled';

const Leaderboard = () => {
	return (
		<WrapContainer>
			<HeaderContainer>
				<h3>Player Rankings</h3>
			</HeaderContainer>
			<MainContainer>
				<PlayerCard playerID={'nodnarb'} />
				<LeaderboardContainer>
					<FilterButton />
					<ScoreTable />
				</LeaderboardContainer>
			</MainContainer>
		</WrapContainer>
	);
};

export default Leaderboard;
