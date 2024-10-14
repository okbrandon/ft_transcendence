import React, { useCallback, useEffect, useState } from 'react';
import { WrapContainer, LeaderboardContainer } from './styles/Leaderboard.styled';
import TimeFrameButtons from './tools/TimeFrameButtons';
import Podium from './Podium';
import ScoreTable from './ScoreTable';
import StatsDropdown from './tools/StatsDropdown';
import { GetLeaderboard } from '../../api/leaderboard';

const Leaderboard = () => {
	const [timeFrame, setTimeFrame] = useState('daily');
	const [stats, setStats] = useState('gamesPlayed');
	const [leaderboardData, setLeaderboardData] = useState([]);

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

	// Handle stats change (e.g., 'gamesPlayed', 'gamesWon', 'gamesLost')
	const handleStatsChange = (newStats) => {
		setStats(newStats);
	};

	return (
		<WrapContainer>
			<TimeFrameButtons timeFrame={timeFrame} handleTimeFrameChange={handleTimeFrameChange} />

			<StatsDropdown stats={stats} handleStatsChange={handleStatsChange} />

			<Podium leaderboardData={leaderboardData} selectedStat={stats} />

			<LeaderboardContainer>
				<ScoreTable data={leaderboardData} selectedStat={stats} />
			</LeaderboardContainer>
		</WrapContainer>
	);
};

export default Leaderboard;
