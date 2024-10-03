import React from 'react';
import { MainStatsItem, MainStatsContainer } from "../styles/main/MainBar.styled";
import { calculateTotalWins, calculateWinDefeatRatio } from '../../../scripts/match';
import { useTranslation } from 'react-i18next';

const MainStats = ({ matchArray }) => {
	const { t } = useTranslation();

	return (
		<MainStatsContainer>
			<MainStatsItem>
				<h2>{t('profile.stats.features.first.title')}</h2>
				<p>-</p>
			</MainStatsItem>
			<MainStatsItem style={{
				borderRight: '1px solid #ccc',
				borderLeft: '1px solid #ccc'
			}}>
				<h2>{t('profile.stats.features.second.title')}</h2>
				<p>{calculateTotalWins(matchArray)}</p>
			</MainStatsItem>
			<MainStatsItem>
				<h2>{t('profile.stats.features.third.title')}</h2>
				<p>{calculateWinDefeatRatio(matchArray)}</p>
			</MainStatsItem>
		</MainStatsContainer>
	);
};

export default MainStats;
