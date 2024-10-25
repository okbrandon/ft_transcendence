import React from 'react';
import { formatMatchData } from '../../../../api/user';
import {
	TournamentOverviewContainer,
	TournamentTable,
} from '../../styles/Tournament/TournamentOverview.styled';

const TournamentOverview = ({ tournamentData }) => {
	return (
		<TournamentOverviewContainer>
			<TournamentTable>
				<thead>
					<tr>
						<th>Players</th>
						<th>Score</th>
						<th>Result</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{tournamentData.matches.map((match, index) => {
						const matchData = formatMatchData(match);
						return (
							<tr key={index}>
								<td>{matchData.playerA.displayName} vs. {matchData.playerB.displayName}</td>
								<td>{matchData.playerA.score} - {matchData.playerB.score}</td>
								<td>{matchData.winner.displayName}</td>
								<td>{matchData.duration}</td>
							</tr>
						);
					})}
				</tbody>
			</TournamentTable>
		</TournamentOverviewContainer>
	)
}

export default TournamentOverview;
