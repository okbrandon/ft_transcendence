import API from './api';

/**
 * Fetch leaderboard based on time frame (daily, weekly, lifetime) and stats (gamesPlayed, gamesWon, gamesLost)
 * @param {string} timeFrame - daily, weekly, lifetime
 * @param {string} stats - gamesPlayed, gamesWon, gamesLost
 * @returns leaderboard data
 */
export const getLeaderboard = async (timeFrame, stats) => {
	try {
		// API call using the timeFrame and stats parameters
		const res = await API.get(`leaderboards/${timeFrame}?stats=${stats}`);
		return res.data;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};
