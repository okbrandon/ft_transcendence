import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreTableStyled, Trophy, Username } from './styles/ScoreTable.styled';

const statHeaders = {
	gamesPlayed: 'Games Played',
	gamesWon: 'Games Won',
	gamesLost: 'Games Lost',
	score: 'Score'
};

const ScoreTable = ({ data, selectedStat }) => {
	const navigate = useNavigate();

	const handleClickUsername = (username) => {
		navigate(`/profile/${username}`);
	}

	return (
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
				<td>
					<Username onClick={() => handleClickUsername(player.user.username)}>
						{player.user.username}
					</Username>
				</td>
				<td>{player.stats[selectedStat]}</td>
				</tr>
			))}
			</tbody>
		</ScoreTableStyled>
	);
};

export default ScoreTable;
