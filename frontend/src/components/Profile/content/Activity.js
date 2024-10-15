import React from "react";
import LineStats from "../stats/LineStats";
import { ActivityContainer } from "../styles/Profile.styled";

const Activity = ({ matchArray }) => {
	return (
		<ActivityContainer>
			<h2>Acitivity History</h2>
			<LineStats matchArray={matchArray}/>
		</ActivityContainer>
	);
};

export default Activity;
