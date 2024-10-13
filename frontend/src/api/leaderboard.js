import API from './api';

const fixedLeaderboardData = [
	{ name: 'Alice', stats: { gamesPlayed: 100, gamesWon: 60, gamesLost: 40 } },
	{ name: 'Bob', stats: { gamesPlayed: 90, gamesWon: 50, gamesLost: 40 } },
	{ name: 'Charlie', stats: { gamesPlayed: 80, gamesWon: 45, gamesLost: 35 } },
	{ name: 'David', stats: { gamesPlayed: 70, gamesWon: 40, gamesLost: 30 } },
	{ name: 'Eve', stats: { gamesPlayed: 60, gamesWon: 35, gamesLost: 25 } },
	{ name: 'Frank', stats: { gamesPlayed: 50, gamesWon: 30, gamesLost: 20 } },
	{ name: 'Grace', stats: { gamesPlayed: 40, gamesWon: 25, gamesLost: 15 } },
	{ name: 'Heidi', stats: { gamesPlayed: 30, gamesWon: 20, gamesLost: 10 } },
	{ name: 'Ivan', stats: { gamesPlayed: 20, gamesWon: 15, gamesLost: 5 } },
	{ name: 'Judy', stats: { gamesPlayed: 10, gamesWon: 5, gamesLost: 5 } },
	{ name: 'Kevin', stats: { gamesPlayed: 100, gamesWon: 70, gamesLost: 30 } },
	{ name: 'Linda', stats: { gamesPlayed: 90, gamesWon: 65, gamesLost: 25 } },
	{ name: 'Mallory', stats: { gamesPlayed: 80, gamesWon: 55, gamesLost: 25 } },
	{ name: 'Nancy', stats: { gamesPlayed: 70, gamesWon: 50, gamesLost: 20 } },
	{ name: 'Oscar', stats: { gamesPlayed: 60, gamesWon: 45, gamesLost: 15 } },
	{ name: 'Peggy', stats: { gamesPlayed: 50, gamesWon: 40, gamesLost: 10 } },
	{ name: 'Quentin', stats: { gamesPlayed: 40, gamesWon: 30, gamesLost: 10 } },
	{ name: 'Rita', stats: { gamesPlayed: 30, gamesWon: 25, gamesLost: 5 } },
	{ name: 'Steve', stats: { gamesPlayed: 20, gamesWon: 15, gamesLost: 5 } },
	{ name: 'Trent', stats: { gamesPlayed: 10, gamesWon: 5, gamesLost: 5 } },
	{ name: 'Ursula', stats: { gamesPlayed: 100, gamesWon: 80, gamesLost: 20 } },
	{ name: 'Victor', stats: { gamesPlayed: 90, gamesWon: 75, gamesLost: 15 } },
	{ name: 'Walter', stats: { gamesPlayed: 80, gamesWon: 65, gamesLost: 15 } },
	{ name: 'Xavier', stats: { gamesPlayed: 70, gamesWon: 55, gamesLost: 15 } },
	{ name: 'Yvonne', stats: { gamesPlayed: 60, gamesWon: 50, gamesLost: 10 } },
	{ name: 'Zelda', stats: { gamesPlayed: 50, gamesWon: 40, gamesLost: 10 } },
	{ name: 'Adam', stats: { gamesPlayed: 40, gamesWon: 30, gamesLost: 10 } },
	{ name: 'Barbara', stats: { gamesPlayed: 30, gamesWon: 25, gamesLost: 5 } },
	{ name: 'Catherine', stats: { gamesPlayed: 20, gamesWon: 15, gamesLost: 5 } },
	{ name: 'Daniel', stats: { gamesPlayed: 10, gamesWon: 5, gamesLost: 5 } },
	{ name: 'Emily', stats: { gamesPlayed: 100, gamesWon: 90, gamesLost: 10 } },
	{ name: 'George', stats: { gamesPlayed: 90, gamesWon: 80, gamesLost: 10 } },
	{ name: 'Hannah', stats: { gamesPlayed: 80, gamesWon: 70, gamesLost: 10 } },
	{ name: 'Isaac', stats: { gamesPlayed: 70, gamesWon: 60, gamesLost: 10 } },
	{ name: 'Julia', stats: { gamesPlayed: 60, gamesWon: 50, gamesLost: 10 } },
	{ name: 'Keith', stats: { gamesPlayed: 50, gamesWon: 40, gamesLost: 10 } },
	{ name: 'Laura', stats: { gamesPlayed: 40, gamesWon: 30, gamesLost: 10 } },
	{ name: 'Michael', stats: { gamesPlayed: 30, gamesWon: 25, gamesLost: 5 } },
	{ name: 'Nina', stats: { gamesPlayed: 20, gamesWon: 15, gamesLost: 5 } },
	{ name: 'Oliver', stats: { gamesPlayed: 10, gamesWon: 5, gamesLost: 5 } },
	{ name: 'Patricia', stats: { gamesPlayed: 100, gamesWon: 85, gamesLost: 15 } },
	{ name: 'Quincy', stats: { gamesPlayed: 90, gamesWon: 75, gamesLost: 15 } },
	{ name: 'Rachel', stats: { gamesPlayed: 80, gamesWon: 65, gamesLost: 15 } },
	{ name: 'Samuel', stats: { gamesPlayed: 70, gamesWon: 55, gamesLost: 15 } },
	{ name: 'Tina', stats: { gamesPlayed: 60, gamesWon: 50, gamesLost: 10 } },
	{ name: 'Vincent', stats: { gamesPlayed: 50, gamesWon: 40, gamesLost: 10 } },
	{ name: 'Wendy', stats: { gamesPlayed: 40, gamesWon: 30, gamesLost: 10 } },
	{ name: 'Xander', stats: { gamesPlayed: 30, gamesWon: 25, gamesLost: 5 } },
	{ name: 'Yolanda', stats: { gamesPlayed: 20, gamesWon: 15, gamesLost: 5 } },
	{ name: 'Zachary', stats: { gamesPlayed: 10, gamesWon: 5, gamesLost: 5 } }
];

export const GetLeaderboardLifetime = async () => {
	try {
		// const res = await API.get('leaderboards/lifetime');
		const res = fixedLeaderboardData;
		return res;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching lifetime leaderboard');
		return [];
	}
}

export const GetLeaderboardDaily = async () => {
	try {
		// const res = await API.get('leaderboards/daily');
		const res = fixedLeaderboardData;
		return res;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching daily leaderboard');
		return [];
	}
}

export const GetLeaderboardWeekly = async () => {
	try {
		// const res = await API.get('leaderboards/weekly');
		const res = fixedLeaderboardData;
		return res;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching weekly leaderboard');
		return [];
	}
}
