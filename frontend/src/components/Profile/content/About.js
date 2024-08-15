import React from "react";
import { AboutContainer, BalanceContainer } from "../../../styles/Profile/content/About.styled";
import DonutStats from "../stats/DonutStats";
import { CardTitle } from "../../../styles/Profile/Profile.styled";
import { StatsContainer } from "../../../styles/Profile/Stats.styled";

const About = ({ user, matchArray }) => {
	return (
		<AboutContainer>
			<CardTitle>ABOUT</CardTitle>
			<p>Nothing interesting here.</p>
			<BalanceContainer>
				<h3>Balance</h3>
				<p><i className="bi bi-coin"/> {user.money} coins</p>
			</BalanceContainer>
			<StatsContainer>
				<h3>Winrate</h3>
				<DonutStats matchArray={matchArray}/>
			</StatsContainer>
		</AboutContainer>
	);
};

export default About;
