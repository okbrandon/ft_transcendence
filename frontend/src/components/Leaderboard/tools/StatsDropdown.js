import React from 'react';

const StatsDropdown = ({ stats, handleStatsChange }) => {
	return (
		<div>
			<select value={stats} onChange={(e) => handleStatsChange(e.target.value)}>
				<option value="gamesPlayed">Games Played</option>
				<option value="gamesWon">Games Won</option>
				<option value="gamesLost">Games Lost</option>
			</select>
		</div>
	);
};

export default StatsDropdown;
