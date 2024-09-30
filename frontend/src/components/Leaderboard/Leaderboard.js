import React, { useState, useEffect } from 'react';
import FilterButton from './tools/FilterButton';
import ScoreTable from './ScoreTable';
import {
	GetLeaderboardLifetime,
	GetLeaderboardDaily,
	GetLeaderboardWeekly
} from '../../api/leaderboard';

import {
	WrapContainer,
	LeaderboardContainer,
	TimeFrameButton,
	TimeFrameContainer
} from './styles/Leaderboard.styled';

const Leaderboard = () => {
	const [timeFrame, setTimeFrame] = useState('lifetime');
	const [leaderboardData, setLeaderboardData] = useState([]);

	useEffect(() => {
		fetchLeaderboardData();
	}, [timeFrame]);

	const fetchLeaderboardData = async () => {
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
	};

	const handleTimeFrameChange = (newTimeFrame) => {
		setTimeFrame(newTimeFrame);
	};

	return (
		<WrapContainer>
			<TimeFrameContainer>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('lifetime')}
					$isActive={timeFrame === 'lifetime'}
				>
					Lifetime
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('daily')}
					$isActive={timeFrame === 'daily'}
				>
					Daily
				</TimeFrameButton>
				<TimeFrameButton
					onClick={() => handleTimeFrameChange('weekly')}
					$isActive={timeFrame === 'weekly'}
				>
					Weekly
				</TimeFrameButton>
			</TimeFrameContainer>
			<LeaderboardContainer>
				<FilterButton />
				<ScoreTable data={leaderboardData} />
			</LeaderboardContainer>
		</WrapContainer>
	);
};

export default Leaderboard;
