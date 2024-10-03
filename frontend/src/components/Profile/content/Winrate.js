import React from "react";
import { WinrateCard, WinrateContainer, SectionContainer } from "../styles/Stats.styled";
import { CardTitle } from "../styles/Profile.styled";
import DonutStats from "../stats/DonutStats";
import { useTranslation } from "react-i18next";

const Winrate = ({ matchArray }) => {
	const { t } = useTranslation();

	return (
		<SectionContainer>
			<CardTitle>{t('profile.winRate.title')}</CardTitle>
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
		</SectionContainer>
	);
};

export default Winrate;
