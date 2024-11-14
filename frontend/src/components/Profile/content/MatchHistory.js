import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MatchCardTable, MatchHistoryContainer } from "../styles/Profile.styled";
import { useNavigate } from "react-router-dom";

const MatchHistory = ({ userID, matches }) => {
	const navigate = useNavigate();
	const [visibleRows, setVisibleRows] = useState([]);
	const containerRef = useRef(null);
	const { t } = useTranslation();

	const handleScroll = useCallback(() => {
		const rows = containerRef.current.querySelectorAll('.match-card');
		if (!rows || rows.length === 0) return;

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
	}, []);

	const handleProfileClick = username => {
		window.scrollTo(0, 0);
		navigate(`/profile/${username}`);
	};

	useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;
		container.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => container.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<>
			<h2>{t('profile.matchHistory.title')}</h2>
			<MatchHistoryContainer>
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
					{matches.length === 0 ? (
						<tbody>
							<tr rowSpan="5">
								<td>
									{t('profile.matchHistory.noResults')}
								</td>
							</tr>
						</tbody>
					) : (
						<tbody ref={containerRef}>
							{matches.map((match, index) => (
								<tr
									key={index}
									className={`match-card ${visibleRows.includes(index) ? "visible" : ""}`}
								>
									<td className="profile hover" onClick={() => handleProfileClick(match.opponent.username)}>{match.opponent.displayName}</td>
									<td>{match.duration}</td>
									<td>{match.me.score} - {match.opponent.score}</td>
									<td>{match.winner.userID === userID ? t('profile.matchHistory.table.victoryLabel') : t('profile.matchHistory.table.defeatLabel')}</td>
									<td>{match.date}</td>
								</tr>
							))}
						</tbody>
					)}
				</MatchCardTable>
			</MatchHistoryContainer>
		</>
	);
};

export default MatchHistory;
