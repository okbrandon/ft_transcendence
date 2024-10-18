import React from "react";
import LineStats from "../stats/LineStats";
import { ActivityContainer } from "../styles/Profile.styled";

const Activity = ({ matches }) => {
	return (
		<ActivityContainer>
			<h2>Acitivity History</h2>
			<LineStats matches={matches}/>
		</ActivityContainer>
	);
};

export default Activity;
