import React from 'react';
import {
	ScoreTableStyled,
} from './styles/ScoreTable.styled';

const ScoreTable = ({ data, selectedStat }) => {
	const topPlayers = data;

	// Determine the header based on the selectedStat
	const getHeader = (stat) => {
		switch (stat) {
			case 'gamesPlayed':
				return 'Games Played';
			case 'gamesWon':
				return 'Games Won';
			case 'gamesLost':
				return 'Games Lost';
			default:
				return 'Score';
		}
	};

	return (
		<ScoreTableStyled>
			<thead>
				<tr>
					<th>Pos</th>
					<th>Player Name</th>
					<th>{getHeader(selectedStat)}</th>
				</tr>
			</thead>
			<tbody>
				{topPlayers.map((player, index) => (
					<tr key={index}>
						<td><i className="bi bi-trophy-fill" /> {index + 1}</td>
						<td>{player.name}</td>
						<td>{player.stats[selectedStat]}</td>
					</tr>
				))}
			</tbody>
		</ScoreTableStyled>
	);
};

export default ScoreTable;
