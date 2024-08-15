import React from "react";
import { ActivityContainer, ActivityLayout } from "../../../styles/Profile/content/Activity.styled";
import { CardTitle } from "../../../styles/Profile/Profile.styled";
import DonutStats from "../stats/DonutStats";

export const Activity = ({ matchArray }) => {
	return (
		<ActivityLayout>
			<CardTitle>ACTIVITY</CardTitle>
			<ActivityContainer>
				<DonutStats matchArray={matchArray.slice(0, 5)}/>
			</ActivityContainer>
		</ActivityLayout>
	);
};

export default Activity;
