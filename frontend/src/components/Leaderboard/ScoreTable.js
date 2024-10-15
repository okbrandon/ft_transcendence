import React from 'react';
import {
	ScoreTableStyled,
	Trophy
} from './styles/ScoreTable.styled';

const statHeaders = {
	gamesPlayed: 'Games Played',
	gamesWon: 'Games Won',
	gamesLost: 'Games Lost',
	score: 'Score'
};

const ScoreTable = ({ data, selectedStat }) => (
	<ScoreTableStyled>
		<thead>
		<tr>
			<th>Pos</th>
			<th>Player Name</th>
			<th>{statHeaders[selectedStat] || 'Score'}</th>
		</tr>
		</thead>
		<tbody>
		{data.map((player, index) => (
			<tr key={player.id || index}>
			<td>
				<Trophy className="bi bi-trophy-fill" $position={index + 1} />
				{index + 1}
			</td>
			<td>{player.user.username}</td>
			<td>{player.stats[selectedStat]}</td>
			</tr>
		))}
		</tbody>
	</ScoreTableStyled>
);

export default ScoreTable;
