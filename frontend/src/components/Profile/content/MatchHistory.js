import React, { useEffect, useState, useRef } from "react";
import { MatchHistoryContainer, MatchCardTable } from "../styles/content/MatchHistory.styled";
import { CardTitle } from "../styles/Profile.styled";
import { getDuration, getDate } from "../../../scripts/match";

const MatchHistory = ({ matchArray }) => {
	const [visibleRows, setVisibleRows] = useState([]);
	const containerRef = useRef(null);

	const handleScroll = () => {
		const rows = containerRef.current.querySelectorAll('.match-card');
		if (!rows || rows.legnth === 0) return;

		const newVisibleRows = [];
		rows.forEach((row, index) => {
			const rect = row.getBoundingClientRect();
			const containerRect = containerRef.current.getBoundingClientRect();
			const isInView = rect.bottom >= containerRect.top && rect.top < containerRect.bottom;
			if (isInView) {
				newVisibleRows.push(index);
			}
		});
		setVisibleRows(newVisibleRows);
	};

	useEffect(() => {
		const container = containerRef.current;
		container.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => container.removeEventListener('scroll', handleScroll);
	}, [])

	return (
		<MatchHistoryContainer>
			<CardTitle>MATCH HISTORY</CardTitle>
			{
				matchArray.length === 0 ? (
					<p>No matches played yet</p>
				) : (
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
						<tbody ref={containerRef}>
							{matchArray.map((match, index) => (
								<tr
									key={index}
									className={`match-card ${visibleRows.includes(index) ? "visible" : ""}`}
								>
									<td>{match.playerB.displayName}</td>
									<td>{getDuration(match.startedAt, match.finishedAt)}</td>
									<td>{match.scores.playerA} - {match.scores.playerB}</td>
									<td>{match.scores.playerA > match.scores.playerB ? "Victory" : "Defeat"}</td>
									<td>{getDate(match.finishedAt)}</td>
								</tr>
							))}
						</tbody>
					</MatchCardTable>
				)
			}
		</MatchHistoryContainer>
	);
};

export default MatchHistory;
