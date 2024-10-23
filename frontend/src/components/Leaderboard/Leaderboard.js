import React, { useEffect, useState, useCallback } from 'react';
import { WrapContainer, LeaderboardContainer } from './styles/Leaderboard.styled';
import TimeFrameButtons from './tools/TimeFrameButtons';
import Podium from './Podium';
import ScoreTable from './ScoreTable';
import StatsDropdown from './tools/StatsDropdown';
import { getLeaderboard } from '../../api/leaderboard';

const Leaderboard = () => {
	const [timeFrame, setTimeFrame] = useState('lifetime');
	const [stats, setStats] = useState('gamesPlayed');
	const [leaderboardData, setLeaderboardData] = useState([]);

	const fetchLeaderboardData = useCallback(async () => {
		const data = await getLeaderboard(timeFrame, stats);
		setLeaderboardData(data);
	}, [timeFrame, stats]);

	useEffect(() => {
		fetchLeaderboardData();
	}, [fetchLeaderboardData]);

	const handleTimeFrameChange = (newTimeFrame) => {
		setTimeFrame(newTimeFrame);
	};

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
