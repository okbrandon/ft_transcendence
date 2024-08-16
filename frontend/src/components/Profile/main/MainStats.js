import React from 'react';
import { MainInfoItem, MainInfoContainer } from "../../../styles/Profile/main/MainBar.styled";
import { calculateTotalWins, calculateWinDefeatRatio } from '../scripts/match';

const MainStats = ({ matchArray }) => {
	return (
		<MainInfoContainer>
			<MainInfoItem>
				<h2 className="title">RANKING</h2>
				<h2 style={{textAlign: 'center'}}>-</h2>
			</MainInfoItem>
			<MainInfoItem style={{
				borderRight: '1px solid #ccc',
				borderLeft: '1px solid #ccc'
			}}>
				<h2 className="title">WINS</h2>
				<h2 style={{textAlign: 'center'}}>{calculateTotalWins(matchArray)}</h2>
			</MainInfoItem>
			<MainInfoItem>
				<h2 className="title">RATIO</h2>
				<h2 style={{textAlign: 'center'}}>{calculateWinDefeatRatio(matchArray)}</h2>
			</MainInfoItem>
		</MainInfoContainer>
	);
};

export default MainStats;
