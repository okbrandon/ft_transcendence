import React from "react";
import LineStats from "../stats/LineStats";
import { ActivityContainer } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const Activity = ({ matches }) => {
	const { t } = useTranslation();

	return (
		<ActivityContainer>
			<h2>{t('profile.about.activity.title')}</h2>
			<LineStats matches={matches}/>
		</ActivityContainer>
	);
};

export default Activity;
