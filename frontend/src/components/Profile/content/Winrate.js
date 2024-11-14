import React from "react";
import { WinrateCard, WinrateContainer } from "../styles/Stats.styled";
import { UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import DonutStats from "../stats/DonutStats";
import { useTranslation } from "react-i18next";
import { calculateTotalDefeats, calculateTotalWins } from "../../../scripts/match";

const Winrate = ({ userID, matches }) => {
	const { t } = useTranslation();
	const seriesLifetime = [calculateTotalWins(matches, userID), calculateTotalDefeats(matches, userID)];
	const seriesLastFive = [calculateTotalWins(matches.slice(0, 5), userID), calculateTotalDefeats(matches.slice(0, 5), userID)];
	const percentageLifetime = seriesLifetime[0] ? Math.round(seriesLifetime[0] / matches.length * 100) : 0;
	const percentageLastFive = seriesLastFive[0] ? Math.round(seriesLastFive[0] / matches.slice(0, 5).length * 100) : 0;

	return (
		<UserInfoItemContainer>
			<UserInfoItemTitle>{t('profile.winRate.title')}</UserInfoItemTitle>
			<WinrateContainer>
				<WinrateCard>
					<h3>{t('profile.winRate.lifetime.title')}</h3>
					<DonutStats series={seriesLifetime} percentage={percentageLifetime}/>
				</WinrateCard>
				<WinrateCard>
					<h3>{t('profile.winRate.lastFive.title')}</h3>
					<DonutStats series={seriesLastFive} percentage={percentageLastFive}/>
				</WinrateCard>
			</WinrateContainer>
		</UserInfoItemContainer>
	);
};

export default Winrate;
