import React from "react";
import { useTranslation } from "react-i18next";
import LineStats from "../stats/LineStats";
import { ActivityContainer } from "../styles/Profile.styled";

const Activity = ({ matchArray }) => {
	const { t } = useTranslation();

	return (
		<ActivityContainer>
			<h2>{t('profile.about.activity.title')}</h2>
			<LineStats matchArray={matchArray}/>
		</ActivityContainer>
	);
};

export default Activity;
