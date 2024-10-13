import API from './api';

// Template data for testing
const templateLeaderboardData = [
	// Daily
	{
		userID: 'user_1',
		name: 'Alice',
		stats: {
			gamesPlayed: 120,
			gamesWon: 80,
			gamesLost: 40
		},
		period: {
			type: 'daily',
			from: '2024-10-10T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_4',
		name: 'David',
		stats: {
			gamesPlayed: 70,
			gamesWon: 40,
			gamesLost: 30
		},
		period: {
			type: 'daily',
			from: '2024-10-10T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_6',
		name: 'Frank',
		stats: {
			gamesPlayed: 50,
			gamesWon: 30,
			gamesLost: 20
		},
		period: {
			type: 'daily',
			from: '2024-10-10T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_7',
		name: 'Grace',
		stats: {
			gamesPlayed: 40,
			gamesWon: 25,
			gamesLost: 15
		},
		period: {
			type: 'daily',
			from: '2024-10-10T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_8',
		name: 'Heidi',
		stats: {
			gamesPlayed: 30,
			gamesWon: 20,
			gamesLost: 10
		},
		period: {
			type: 'daily',
			from: '2024-10-10T00:00:00Z',
			to: new Date().toISOString(),
		}
	},

	// Weekly
	{
		userID: 'user_2',
		name: 'Bob',
		stats: {
			gamesPlayed: 95,
			gamesWon: 60,
			gamesLost: 35
		},
		period: {
			type: 'weekly',
			from: '2024-10-03T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_5',
		name: 'Eve',
		stats: {
			gamesPlayed: 60,
			gamesWon: 35,
			gamesLost: 25
		},
		period: {
			type: 'weekly',
			from: '2024-10-03T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_9',
		name: 'Ivan',
		stats: {
			gamesPlayed: 20,
			gamesWon: 15,
			gamesLost: 5
		},
		period: {
			type: 'weekly',
			from: '2024-10-03T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_10',
		name: 'Judy',
		stats: {
			gamesPlayed: 10,
			gamesWon: 5,
			gamesLost: 5
		},
		period: {
			type: 'weekly',
			from: '2024-10-03T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_11',
		name: 'Kevin',
		stats: {
			gamesPlayed: 100,
			gamesWon: 70,
			gamesLost: 30
		},
		period: {
			type: 'weekly',
			from: '2024-10-03T00:00:00Z',
			to: new Date().toISOString(),
		}
	},

	// Lifetime
	{
		userID: 'user_3',
		name: 'Charlie',
		stats: {
			gamesPlayed: 85,
			gamesWon: 50,
			gamesLost: 35
		},
		period: {
			type: 'lifetime',
			from: '2023-01-01T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_12',
		name: 'Linda',
		stats: {
			gamesPlayed: 90,
			gamesWon: 65,
			gamesLost: 25
		},
		period: {
			type: 'lifetime',
			from: '2023-01-01T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_13',
		name: 'Mallory',
		stats: {
			gamesPlayed: 80,
			gamesWon: 55,
			gamesLost: 25
		},
		period: {
			type: 'lifetime',
			from: '2023-01-01T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_14',
		name: 'Nancy',
		stats: {
			gamesPlayed: 70,
			gamesWon: 50,
			gamesLost: 20
		},
		period: {
			type: 'lifetime',
			from: '2023-01-01T00:00:00Z',
			to: new Date().toISOString(),
		}
	},
	{
		userID: 'user_15',
		name: 'Oscar',
		stats: {
			gamesPlayed: 60,
			gamesWon: 45,
			gamesLost: 15
		},
		period: {
			type: 'lifetime',
			from: '2023-01-01T00:00:00Z',
			to: new Date().toISOString(),
		}
	}
];

/**
 * Fetch leaderboard based on time frame (daily, weekly, lifetime) and stats (gamesPlayed, gamesWon, gamesLost)
 * @param {string} timeFrame - daily, weekly, lifetime
 * @param {string} stats - gamesPlayed, gamesWon, gamesLost
 * @returns leaderboard data
 */
export const GetLeaderboard = async (timeFrame, stats) => {
	try {
		// API call using the timeFrame and stats parameters
		// const res = await API.get(`leaderboards/${timeFrame}?stats=${stats}`);			// Uncomment this line when there is games data to fetch

		// Return template data for testing
		return templateLeaderboardData;
		return res.data; // Return the leaderboard data already sorted by the backend
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching leaderboard');
		return [];
	}
};

// Example usage:
// const leaderboardData = await GetLeaderboard('daily', 'gamesPlayed');
// const leaderboardData = await GetLeaderboard('weekly', 'gamesWon');
