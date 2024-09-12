import React from 'react';
import { MainStatsItem, MainStatsContainer } from "../styles/main/MainBar.styled";
import { calculateTotalWins, calculateWinDefeatRatio } from '../scripts/match';

const MainStats = ({ matchArray }) => {
	return (
		<MainStatsContainer>
			<MainStatsItem>
				<h2>RANKING</h2>
				<p>-</p>
			</MainStatsItem>
			<MainStatsItem style={{
				borderRight: '1px solid #ccc',
				borderLeft: '1px solid #ccc'
			}}>
				<h2>WINS</h2>
				<p>{calculateTotalWins(matchArray)}</p>
			</MainStatsItem>
			<MainStatsItem>
				<h2>RATIO</h2>
				<p>{calculateWinDefeatRatio(matchArray)}</p>
			</MainStatsItem>
		</MainStatsContainer>
	);
};

export default MainStats;
