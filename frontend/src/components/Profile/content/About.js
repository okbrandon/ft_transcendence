import React from "react";
import LineStats from "../stats/LineStats";
import { AboutContainer, ActivityContainer, BalanceContainer } from "../styles/content/About.styled";
import { CardTitle } from "../styles/Profile.styled";

const About = ({ profileUser, matchArray }) => {
	return (
		<AboutContainer>
			<CardTitle>ABOUT</CardTitle>
			<p>{profileUser.bio ? profileUser.bio : 'Nothing interesting here.'}</p>
			<BalanceContainer>
				<h3>Balance</h3>
				<p><i className="bi bi-coin"/> {profileUser.money} coins</p>
			</BalanceContainer>
			<ActivityContainer>
				<h3>Activity</h3>
				<LineStats matchArray={matchArray}/>
			</ActivityContainer>
		</AboutContainer>
	);
};

export default About;
