export const calculateTotalWins = (matches, userID) => {
	if (!matches.length) return 0;
	return matches.filter(match => match.winner.userID === userID).length;
};

export const calculateTotalDefeats = (matches, userID) => {
	if (!matches.length) return 0;
	return matches.filter(match => match.winner.userID !== userID).length;
};

export const calculateWinDefeatRatio = (matches, userID) => {
	if (!matches.length) return 0;

	const wins = calculateTotalWins(matches, userID);

	return (wins / matches.length).toFixed(2);
};

export const getNumberOfMatchesPerMonth = matches => {
	const matchesPerMonth = Array.from({length: 12}, () => 0);

	matches.forEach(match => {
		const month = new Date(match.date).getMonth();
		matchesPerMonth[month]++;
	});

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
