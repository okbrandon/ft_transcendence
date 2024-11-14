import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreTableStyled, Trophy, Username } from './styles/ScoreTable.styled';
import { formatUserData } from '../../api/user';
import { useTranslation } from 'react-i18next';

const ScoreTable = ({ data, selectedStat }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const statHeaders = {
		gamesPlayed: t('leaderboard.stats.gamesPlayed'),
		gamesWon: t('leaderboard.stats.gamesWon'),
		gamesLost: t('leaderboard.stats.gamesLost'),
		score: t('leaderboard.stats.score')
	};

	const handleClickUsername = (username) => {
		navigate(`/profile/${username}`);
	}

	return (
		<ScoreTableStyled>
			<thead>
			<tr>
				<th>{t('leaderboard.table.columns.position')}</th>
				<th>{t('leaderboard.table.columns.username')}</th>
				<th>{statHeaders[selectedStat] || t('leaderboard.table.columns.defaultScore')}</th>
			</tr>
			</thead>
			<tbody>
			{data.map((player, index) => {
				const formattedUser = formatUserData(player.user);
				return (
					<tr key={player.id || index}>
					<td>
						<Trophy className="bi bi-trophy-fill" $position={index + 1} />
						{index + 1}
					</td>
					<td>
						<Username onClick={() => handleClickUsername(player.user.username)}>
							{formattedUser.displayName}
						</Username>
					</td>
					<td>{player.stats[selectedStat]}</td>
					</tr>
				);
			})}
			</tbody>
		</ScoreTableStyled>
	);
};

export default ScoreTable;
