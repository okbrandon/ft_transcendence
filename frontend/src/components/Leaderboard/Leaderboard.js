import React, { useState, useEffect, useCallback } from 'react';
import ScoreTable from './ScoreTable';
import Podium from './Podium';
import { GetLeaderboard } from '../../api/leaderboard';  // Adjusted import
import {
	WrapContainer,
	LeaderboardContainer
} from './styles/Leaderboard.styled';
import TimeFrameButtons from './tools/TimeFrameButtons';

const Leaderboard = () => {
	const [timeFrame, setTimeFrame] = useState('lifetime');
	const [stats, setStats] = useState('gamesWon');  // Default to 'gamesWon', can be changed as needed
	const [leaderboardData, setLeaderboardData] = useState([]);

	// Fetch leaderboard data based on current timeFrame and stats
	const fetchLeaderboardData = useCallback(async () => {
		const data = await GetLeaderboard(timeFrame, stats);
		setLeaderboardData(data);
	}, [timeFrame, stats]);

	// Trigger fetching when timeFrame or stats change
	useEffect(() => {
		fetchLeaderboardData();
	}, [fetchLeaderboardData]);

	// Handle time frame change (e.g., 'daily', 'weekly', 'lifetime')
	const handleTimeFrameChange = (newTimeFrame) => {
		setTimeFrame(newTimeFrame);
	};

	// Optional: Handle stats change if needed (e.g., 'gamesPlayed', 'gamesLost')
	const handleStatsChange = (newStats) => {
		setStats(newStats);
	};

	return (
		<WrapContainer>
			{/* TimeFrameButtons to change timeFrame */}
			<TimeFrameButtons timeFrame={timeFrame} handleTimeFrameChange={handleTimeFrameChange} />

			{/* Podium component for top 3 users */}
			<Podium leaderboardData={leaderboardData} />

			{/* LeaderboardContainer to display the entire leaderboard */}
			<LeaderboardContainer>
				<ScoreTable data={leaderboardData} />
			</LeaderboardContainer>
		</WrapContainer>
	);
};

export default Leaderboard;
