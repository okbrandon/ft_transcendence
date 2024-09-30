import API from './api';

const Names = [
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eve',
  'Frank',
  'Grace',
  'Heidi',
  'Ivan',
  'Judy',
  'Kevin',
  'Linda',
  'Mallory',
  'Nancy',
  'Oscar',
  'Peggy',
  'Quentin',
  'Rita',
  'Steve',
  'Trent',
  'Ursula',
  'Victor',
  'Walter',
  'Xavier',
  'Yvonne',
  'Zelda',
  'Adam',
  'Barbara',
  'Catherine',
  'Daniel',
  'Emily',
  'George',
  'Hannah',
  'Isaac',
  'Julia',
  'Keith',
  'Laura',
  'Michael',
  'Nina',
  'Oliver',
  'Patricia',
  'Quincy',
  'Rachel',
  'Samuel',
  'Tina',
  'Vincent',
  'Wendy',
  'Xander',
  'Yolanda',
  'Zachary'
];

const customRandomGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateLeaderboardData = (numEntries = 50) => {
  return Array(numEntries)
    .fill()
    .map(() => {
      const gamesPlayed = Math.floor(Math.random() * 100) + 1;
      const gamesWon = customRandomGenerator(0, gamesPlayed);
      const name = Names[Math.floor(Math.random() * Names.length)];
      return {
        name: name,
        stats: {
          gamesPlayed: gamesPlayed,
          gamesWon: gamesWon,
          gamesLost: gamesPlayed - gamesWon
        }
      };
    });
};

export const GetLeaderboardLifetime = async () => {
	try {
		// const res = await API.get('leaderboards/lifetime');
    const res = generateLeaderboardData();
		return res;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred fetching lifetime leaderboard');
		return [];
	}
}

export const GetLeaderboardDaily = async () => {
  try {
    // const res = await API.get('leaderboards/daily');
    const res = generateLeaderboardData();
    return res;
  } catch (err) {
    console.error(err.response?.data?.error || 'An error occurred fetching daily leaderboard');
    return [];
  }
}

export const GetLeaderboardWeekly = async () => {
  try {
    // const res = await API.get('leaderboards/weekly');
    const res = generateLeaderboardData();
    return res;
  } catch (err) {
    console.error(err.response?.data?.error || 'An error occurred fetching weekly leaderboard');
    return [];
  }
}
