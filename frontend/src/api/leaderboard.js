import API from './api';



/**
 * Fetch leaderboard based on time frame (daily, weekly, lifetime) and stats (gamesPlayed, gamesWon, gamesLost)
 * @param {string} timeFrame - daily, weekly, lifetime
 * @param {string} stats - gamesPlayed, gamesWon, gamesLost
 * @returns leaderboard data
 */
export const GetLeaderboard = async (timeFrame, stats) => {
	try {
		// API call using the timeFrame and stats parameters
		const res = await API.get(`leaderboards/${timeFrame}?stats=${stats}`);
		return res.data; // Return the leaderboard data already sorted by the backend
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching leaderboard');
		return [];
	}
};

// Example usage:
// const leaderboardData = await GetLeaderboard('daily', 'gamesPlayed');
// const leaderboardData = await GetLeaderboard('weekly', 'gamesWon');
