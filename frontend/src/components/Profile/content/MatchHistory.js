import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatchHistoryContainer, MatchCardTable } from "../../../styles/Profile/content/MatchHistory.styled";
import { CardTitle } from "../../../styles/Profile/Profile.styled";
import { getDuration, getDate } from "../scripts/match";

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

const MatchHistory = ({ matchArray }) => {
	return (
		<MatchHistoryContainer>
			<CardTitle>MATCH HISTORY</CardTitle>
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
		</MatchHistoryContainer>
	);
};

export default MatchHistory;
