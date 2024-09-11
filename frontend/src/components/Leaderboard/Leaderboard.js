import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';

const WrapContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 70px 50px 30px 50px;
`;

/* Player's Ranking | Top Win/Loss | Time Button */
const TopDetails = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`;

const LeftChildContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const RankingHeader = () => {
	return <h3>PLayer Rankings</h3>;
};

const ScorePosContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const StatItem = styled.div`
	margin-right: 10px;
	opacity: 0.8;
`;

const ScoreDisplay = ({ score }) => {
	return <StatItem>Your Score: {score}</StatItem>;
};

const PositionDisplay = ({ position }) => {
	return <StatItem>Your Position: {position}</StatItem>;
};

const RightChildContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const TopButtonDropDown = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 5px;
`;

const Nav = () => {
	return (
		<TopButtonDropDown>
			<NavDropdown title="Top Win" id="nav-dropdown" menuVariant='dark'>
				<NavDropdown.Item eventKey="4.1">Top Win</NavDropdown.Item>
				<NavDropdown.Item eventKey="4.2">Top Loss</NavDropdown.Item>
				<NavDropdown.Item eventKey="4.3">Top Draw</NavDropdown.Item>
				<NavDropdown.Item eventKey="4.4">Top Win Rate</NavDropdown.Item>
			</NavDropdown>
		</TopButtonDropDown>
	);
};

const TimeButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const ButtonWrapper = styled.div`
	display: block;
	flex-direction: row;
	justify-content: center;
	margin-right: 7px;

	&:last-child {
		margin-right: 0;
	}
`;

const TableLeaderboard = styled.table`
	border-collapse: collapse;
	width: 100%;
	margin-top: 20px;

	th, td {
		border-top: 1px solid #ddd;
		padding: 8px;
	}

	th {
		background-color: grey;
		color: white;
		text-align: center;
	}
`;

const Leaderboard = () => {
	return (
		<WrapContainer>
			<TopDetails>
				<LeftChildContainer>
					<RankingHeader/>
					<ScorePosContainer>
						<ScoreDisplay score="18975"/>
						<PositionDisplay position="1st"/>
					</ScorePosContainer>
				</LeftChildContainer>
				<RightChildContainer>
					<Nav/>
					<TimeButtonContainer>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Daily</Button>
					</ButtonWrapper>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Weekly</Button>
					</ButtonWrapper>
					<ButtonWrapper>
						<Button variant="secondary" size="sm">Lifetime</Button>
					</ButtonWrapper>
					</TimeButtonContainer>
				</RightChildContainer>
			</TopDetails>
			<TableLeaderboard>
				<thead>
					<tr>
						<th>Pos</th>
						<th>Player Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>Alice</td>
						<td>100</td>
					</tr>
					<tr>
						<td>2</td>
						<td>Brandon</td>
						<td>90</td>
					</tr>
					<tr>
						<td>3</td>
						<td>Hanmin</td>
						<td>80</td>
					</tr>
				</tbody>
			</TableLeaderboard>
		</WrapContainer>
	);
};

export default Leaderboard;
