import React, { useEffect, useState, useRef } from "react";
import { getDuration, getDate } from "../../../scripts/match";
import { useTranslation } from "react-i18next";
import { MatchCardTable, MatchHistoryContainer } from "../styles/Profile.styled";

const MatchHistory = ({ matchArray }) => {
	const [visibleRows, setVisibleRows] = useState([]);
	const containerRef = useRef(null);
	const { t } = useTranslation();

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
	}, []);

	return (
		<MatchHistoryContainer>
			<h2>{t('profile.matchHistory.title')}</h2>
			{matchArray.length === 0 ? (
				<p>{t('profile.matchHistory.noResults')}</p>
			) : (
				<MatchCardTable>
					<thead>
						<tr>
							<th>{t('profile.matchHistory.table.opponent')}</th>
							<th>{t('profile.matchHistory.table.duration')}</th>
							<th>{t('profile.matchHistory.table.scores')}</th>
							<th>{t('profile.matchHistory.table.results')}</th>
							<th>{t('profile.matchHistory.table.date')}</th>
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
								<td>{match.scores.playerA > match.scores.playerB ? t('profile.matchHistory.table.victoryLabel') : t('profile.matchHistory.table.defeatLabel')}</td>
								<td>{getDate(match.finishedAt)}</td>
							</tr>
						))}
					</tbody>
				</MatchCardTable>
			)}
		</MatchHistoryContainer>
	);
};

export default MatchHistory;
