import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatchCardTable } from "../../styles/Profile.styled";

const matchArrayTest = [
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
];

const variants = {
	hidden: { opacity: 0, y: -10 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
		delay: i * 0.1,
		duration: 0.5,
		},
	}),
};

const getDuration = (startedAt, finishedAt) => {
	const startDate = new Date(startedAt);
	const endDate = new Date(finishedAt);

	const durationMs = endDate - startDate;
	const durationSeconds = Math.floor((durationMs % 60000) / 1000);
	const durationMinutes = Math.floor(durationMs / 60000);

	return `${durationMinutes}m ${durationSeconds}s`;
};

const getDate = (timestamp) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}/${month}/${day}`;
}

const MatchHistory = () => {
	const matchArray = matchArrayTest;

	if (!matchArray) {
		console.log('MathHistory: matchArray is null');
		return null;
	}

	return (
		<>
			{
				matchArray.length === 0 ? (
					<p>No matches played yet</p>
				) : (
					<AnimatePresence>
						<MatchCardTable>
							<thead>
								<tr>
									<th>Opponent</th>
									<th>Duration</th>
									<th>Score</th>
									<th>Result</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{matchArray.map((match, index) => (
									<motion.tr
										key={index}
										initial="hidden"
										animate="visible"
										custom={index}
										variants={variants}
									>
										<td>{match.playerB.displayName}</td>
										<td>{getDuration(match.startedAt, match.finishedAt)}</td>
										<td>{match.scores.playerA} - {match.scores.playerB}</td>
										<td>{match.scores.playerA > match.scores.playerB ? "Victory" : "Defeat"}</td>
										<td>{getDate(match.finishedAt)}</td>
									</motion.tr>
								))}
							</tbody>
						</MatchCardTable>
					</AnimatePresence>
				)
			}
		</>
	);
};

export default MatchHistory;
