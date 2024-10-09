import React from "react";
import LineStats from "../stats/LineStats";
import { AboutContainer, ActivityContainer, BalanceContainer } from "../styles/content/About.styled";
import { CardTitle } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const About = ({ profileUser, matchArray }) => {
	const { t } = useTranslation();

	return (
		<AboutContainer>
			<CardTitle>{t('profile.about.title')}</CardTitle>
			<p>{profileUser.bio ? profileUser.bio : t('profile.about.bio.notSet')}</p>
			<BalanceContainer>
				<h3>{t('profile.about.balance.title')}</h3>
				<p>{t('store.currency.icon')} {profileUser.money} {t('store.currency.type')}</p>
			</BalanceContainer>
			<ActivityContainer>
				<h3>{t('profile.about.activity.title')}</h3>
				<LineStats matchArray={matchArray}/>
			</ActivityContainer>
		</AboutContainer>
	);
};

export default About;
