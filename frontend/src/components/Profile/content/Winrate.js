import React from "react";
import { WinrateCard, WinrateContainer, WinrateLayout } from "../styles/Stats.styled";
import { CardTitle } from "../styles/Profile.styled";
import DonutStats from "../stats/DonutStats";

const Winrate = ({ matchArray }) => {
	return (
		<WinrateLayout>
			<CardTitle>WINRATE</CardTitle>
			<WinrateContainer>
				<WinrateCard>
					<h3>All Time</h3>
					<DonutStats matchArray={matchArray}/>
				</WinrateCard>
				<WinrateCard>
					<h3>Last 5 Games</h3>
					<DonutStats matchArray={matchArray.slice(0, 5)}/>
				</WinrateCard>
			</WinrateContainer>
		</WinrateLayout>
	);
};

export default Winrate;
