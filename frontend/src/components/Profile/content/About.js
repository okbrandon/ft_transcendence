import React from "react";
import { AboutContainer, ActivityContainer, BalanceContainer } from "../../../styles/Profile/content/About.styled";
import { CardTitle } from "../../../styles/Profile/Profile.styled";
import LineStats from "../stats/LineStats";

const About = ({ user, matchArray }) => {
	return (
		<AboutContainer>
			<CardTitle>ABOUT</CardTitle>
			<p>Nothing interesting here.</p>
			<BalanceContainer>
				<h3>Balance</h3>
				<p><i className="bi bi-coin"/> {user.money} coins</p>
			</BalanceContainer>
			<ActivityContainer>
				<h3>Activity</h3>
				<LineStats matchArray={matchArray}/>
			</ActivityContainer>
		</AboutContainer>
	);
};

export default About;
