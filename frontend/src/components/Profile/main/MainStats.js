import React from 'react';
import { MainStatsItem, MainStatsContainer } from "../styles/main/MainBar.styled";
import { calculateTotalDefeats, calculateTotalWins, calculateWinDefeatRatio } from '../../../scripts/match';
import { useTranslation } from 'react-i18next';

const MainStats = ({ userID, matches }) => {
	const { t } = useTranslation();

	return (
		<MainStatsContainer>
			<MainStatsItem>
				<h2>Wins</h2>
				<p>{calculateTotalWins(matches, userID)}</p>
			</MainStatsItem>
			<MainStatsItem style={{
				borderRight: '1px solid #ccc',
				borderLeft: '1px solid #ccc'
			}}>
				<h2>Loss</h2>
				<p>{calculateTotalDefeats(matches, userID)}</p>
			</MainStatsItem>
			<MainStatsItem>
				<h2>Ratio</h2>
				<p>{calculateWinDefeatRatio(matches, userID)}</p>
			</MainStatsItem>
		</MainStatsContainer>
	);
};

export default MainStats;
