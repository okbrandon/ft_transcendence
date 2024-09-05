import React, { useState } from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

const LeaderboardContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const UpperContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 70px;
`;

const LowerRankingContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const PlayerRankings = styled.div`
	display: flex;
	flex-direction: column;
`;

const LowerLeftStatsContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

const LowerRightContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-top: 5px;
`;

const StatItem = styled.div`
	margin-right: 10px;
`;

const ScoreDisplay = ({ score }) => {
	return <StatItem>Your Score: {score}</StatItem>;
};

const PositionDisplay = ({ position }) => {
	return <StatItem>Your Position: {position}</StatItem>;
};

const TopWinLossContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const ButtonWrapper = styled.div`
	margin-right: 7px;

	&:last-child {
		margin-right: 0;
	}
`;

export const Leaderboard = () => {
	return (
		// Parent container
		<LeaderboardContainer>
			<UpperContainer>
				<LowerRankingContainer>
					<PlayerRankings><h3>Player Rankings</h3></PlayerRankings>
					<LowerLeftStatsContainer>
						<ScoreDisplay score="29"/>
						<PositionDisplay position="1st"/>
					</LowerLeftStatsContainer>
				</LowerRankingContainer>
				<TopWinLossContainer>
					<NavDropdown title="Top Win" id="nav-dropdown" menuVariant='dark'>
						<NavDropdown.Item eventKey="4.1">Top Win</NavDropdown.Item>
						<NavDropdown.Item eventKey="4.2">Top Loss</NavDropdown.Item>
						<NavDropdown.Item eventKey="4.3">Top Draw</NavDropdown.Item>
						<NavDropdown.Item eventKey="4.4">Top Win Rate</NavDropdown.Item>
					</NavDropdown>
				</TopWinLossContainer>
				<LowerRightContainer>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Daily</Button>
					</ButtonWrapper>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Weekly</Button>
					</ButtonWrapper>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Lifetime</Button>
					</ButtonWrapper>
				</LowerRightContainer>
			</UpperContainer>
		</LeaderboardContainer>
				// Child Ranking Container
					// Player Rankings <div>
					// Your score <div>
					// Position <div>
				// Child TOP WIN/LOSS Container
					// Daily <button>
					// Weekly <button>
					// Lifetime <button>
			// Lower Child Container
				// <table>
					// <thead>
						// <tr>
							// <th>Pos</th>
							// <th>Player Name</th>
							// <th>Score</th>
						// </tr>
					// </thead>
					// Add content examples in <tbody>
						// <tr>
							// <td>1</td>
							// <td>Alice</td>
							// <td>100</td>
						// </tr>
						// <tr>
							// <td>2</td>
							// <td>Brandonation</td>
							// <td>90</td>
						// </tr>
						// <tr>
							// <td>3</td>
							// <td>Hanministrateur</td>
							// <td>80</td>
						// </tr>
					// </tbody>
				// </table>
	);
};
