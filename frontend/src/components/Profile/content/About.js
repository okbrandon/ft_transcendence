import React from "react";
import LineStats from "../stats/LineStats";
import { ActivityContainer, BalanceContainer } from "../styles/content/About.styled";
import { UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const About = ({ profileUser, matchArray }) => {
	const userID = localStorage.getItem('userID');
	const { t } = useTranslation();

	return (
		<UserInfoItemContainer>
			<UserInfoItemTitle>{t('profile.about.title')}</UserInfoItemTitle>
			{userID === profileUser.userID && (
				<BalanceContainer>
					<h3>{t('profile.about.balance.title')}</h3>
					<p>{t('store.currency.icon')} {profileUser.money} {t('store.currency.type')}</p>
				</BalanceContainer>
			)}
			<ActivityContainer>
				<h3>{t('profile.about.activity.title')}</h3>
				<LineStats matchArray={matchArray}/>
			</ActivityContainer>
		</UserInfoItemContainer>
	);
};

export default About;
