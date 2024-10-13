import React, { useState, useEffect, useCallback } from 'react';
import ScoreTable from './ScoreTable';
import Podium from './Podium';
import {
	GetLeaderboardLifetime,
	GetLeaderboardDaily,
	GetLeaderboardWeekly
} from '../../api/leaderboard';

import {
	WrapContainer,
	LeaderboardContainer
} from './styles/Leaderboard.styled';
import TimeFrameButtons from './tools/TimeFrameButtons';

const Leaderboard = () => {
	const [timeFrame, setTimeFrame] = useState('lifetime');
	const [leaderboardData, setLeaderboardData] = useState([]);

	const fetchLeaderboardData = useCallback(async () => {
		let data;
		switch (timeFrame) {
			case 'daily':
				data = await GetLeaderboardDaily();
				break;
			case 'weekly':
				data = await GetLeaderboardWeekly();
				break;
			default:
				data = await GetLeaderboardLifetime();
		}
		setLeaderboardData(data);
	}, [timeFrame]);

	useEffect(() => {
		fetchLeaderboardData();
	}, [fetchLeaderboardData]);

	const handleTimeFrameChange = (newTimeFrame) => {
		setTimeFrame(newTimeFrame);
	};

	return (
		<WrapContainer>
			<TimeFrameButtons timeFrame={timeFrame} handleTimeFrameChange={handleTimeFrameChange} />
			<Podium leaderboardData={leaderboardData} />
			<LeaderboardContainer>
				<ScoreTable data={leaderboardData} />
			</LeaderboardContainer>
		</WrapContainer>
	);
};

export default Leaderboard;
