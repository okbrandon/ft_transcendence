export const calculateTotalWins = (matchArray) => {
	return matchArray.filter((match) => match.scores.playerA > match.scores.playerB).length;
};

export const calculateTotalDefeats = (matchArray) => {
	return matchArray.filter((match) => match.scores.playerA < match.scores.playerB).length;
};

export const calculateWinDefeatRatio = (matchArray) => {
	const wins = calculateTotalWins(matchArray);

	return (wins / matchArray.length).toFixed(2);
};

export const getNumberOfMatchesPerMonth = (matchArray) => {
	// Initialize an object with 12 zeros
	const matchesPerMonth = Array.from({length: 12}, () => 0);

	matchArray.forEach(match => {
		const month = new Date(match.startedAt).getMonth();
		matchesPerMonth[month]++;
	});

	console.log(matchesPerMonth);
	return matchesPerMonth;
};

export const getDuration = (startedAt, finishedAt) => {
	const startDate = new Date(startedAt);
	const endDate = new Date(finishedAt);

	const durationMs = endDate - startDate;
	const durationSeconds = Math.floor((durationMs % 60000) / 1000);
	const durationMinutes = Math.floor(durationMs / 60000);

	return `${durationMinutes}m ${durationSeconds}s`;
};

export const getDate = (timestamp) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}/${month}/${day}`;
};
