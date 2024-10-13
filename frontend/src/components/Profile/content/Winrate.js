import React from "react";
import { WinrateCard, WinrateContainer } from "../styles/Stats.styled";
import { UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import DonutStats from "../stats/DonutStats";
import { useTranslation } from "react-i18next";

const Winrate = ({ matchArray }) => {
	const { t } = useTranslation();

	return (
		<UserInfoItemContainer>
			<UserInfoItemTitle>Winrate</UserInfoItemTitle>
			<WinrateContainer>
				<WinrateCard>
					<h3>{t('profile.winRate.lifetime.title')}</h3>
					<DonutStats matchArray={matchArray}/>
				</WinrateCard>
				<WinrateCard>
					<h3>{t('profile.winRate.lastFive.title')}</h3>
					<DonutStats matchArray={matchArray.slice(0, 5)}/>
				</WinrateCard>
			</WinrateContainer>
		</UserInfoItemContainer>
	);
};

export default Winrate;
