import React from 'react';
import {
	ScoreTableStyled,
} from './styles/ScoreTable.styled';

const ScoreTable = () => {
	const players = [
		{ name: 'Hanmin', wins: 100 },
		{ name: 'nodnarb', wins: 90 },
		{ name: 'Charlie', wins: 80 },
		{ name: 'Evan', wins: 70 },
		{ name: 'Emilien', wins: 60 },
		{ name: 'Frank', wins: 50 },
		{ name: 'Grace', wins: 40 },
		{ name: 'Hannah', wins: 30 },
		{ name: 'Ivan', wins: 20 },
		{ name: 'Jack', wins: 10 },
	];

	const topPlayers = players.sort((a, b) => b.wins - a.wins).slice(0, 10);

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
						<td>{player.wins}</td>
					</tr>
				))}
			</tbody>
		</ScoreTableStyled>
	);
};

export default ScoreTable;
