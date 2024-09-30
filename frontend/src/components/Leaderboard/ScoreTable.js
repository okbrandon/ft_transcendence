import React from 'react';
import {
	ScoreTableStyled,
} from './styles/ScoreTable.styled';

const ScoreTable = ({ data }) => {
	const topPlayers = data;

	// temporary sorting function
	topPlayers.sort((a, b) => {
		return b.stats.gamesWon - a.stats.gamesWon;
	});

	return (
		<ScoreTableStyled>
			<thead>
				<tr>
					<th>Pos</th>
					<th>Player Name</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{topPlayers.map((player, index) => (
					<tr key={index}>
						<td>{index + 1}</td>
						<td>{player.name}</td>
						<td>{player.stats.gamesWon}</td>
					</tr>
				))}
			</tbody>
		</ScoreTableStyled>
	);
};

export default ScoreTable;
