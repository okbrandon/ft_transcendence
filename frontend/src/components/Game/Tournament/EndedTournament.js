import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMatchData, formatUserData } from '../../../api/user';
import {
	Background,
	EndTournamentContainer,
	MatchCardTable,
	TournamentHeader,
	TournamentOverview,
	WinnerDiv,
	WinnerContainer,
	WinnerInfo,
} from '../styles/Tournament/EndedTournament.styled';
import { useTournament } from '../../../context/TournamentContext';
import TournamentStats from './TournamentStats';
import Confetti from 'react-confetti';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../styles/shared/Loader.styled';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useTranslation } from 'react-i18next';

const EndedTournament = () => {
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { endTournamentData, tournament, setTournament } = useTournament();
	const [matches, setMatches] = useState(null);
	const [totalScores, setTotalScores] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (!endTournamentData) return;
		setMatches(endTournamentData.matches.map(formatMatchData));
		setUser(prev => ({
			...prev,
			tournamentID: null
		}));
	}, [endTournamentData, setUser]);

	useEffect(() => {
		if (!tournament || !matches) return;

		for (const player of tournament.participants) {
			const formattedPlayer = formatUserData(player);
			const playerScore = matches.reduce((acc, match) => {
				if (match.playerA.userID === player.userID) {
					return acc + match.playerA.score;
				} else if (match.playerB.userID === player.userID) {
					return acc + match.playerB.score;
				}
				return acc;
			}, 0);
			setTotalScores(prevState => ({
				...prevState,
				[formattedPlayer.displayName]: playerScore
			}))
		}
	}, [tournament, matches]);

	if (!endTournamentData || !tournament || !matches || !totalScores) {
		return (
			<EndTournamentContainer $loading={true}>
				<Loader/>
			</EndTournamentContainer>
		);
	}

	const handleProfileClick = username => {
		window.scrollTo(0, 0);
		navigate(`/profile/${username}`);
	};

	const handleLeave = () => {
		setUser(prev => ({
			...prev,
			tournamentID: null
		}));
		setTournament(null);
		navigate('/playmenu');
	};

	const renderMatch = ({ playerA, playerB, duration }, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td className='profile hover versus' onClick={() => handleProfileClick(playerA.username)}>{playerA.displayName}</td>
			<td className='profile hover' onClick={() => handleProfileClick(playerB.username)}>{playerB.displayName}</td>
			<td>{duration}</td>
			<td>{playerA.score} - {playerB.score}</td>
		</tr>
	);

	return (
		<EndTournamentContainer $loading={false}>
			<WinnerContainer>
				<Confetti recycle={false} numberOfPieces={500} style={{height: '100%'}}/>
				<WinnerDiv>
					<h2>{t('game.tournaments.endPage.winner.title')}</h2>
					<WinnerInfo $background={endTournamentData.winner.bannerID}>
						<img src={endTournamentData.winner.avatarID} alt={`${endTournamentData.winner.displayName}'s avatar`}/>
						<div className='info'>
							<h3 onClick={() => handleProfileClick(endTournamentData.winner.username)}>{endTournamentData.winner.displayName}</h3>
							<p>{endTournamentData.winner.username}</p>
						</div>
					</WinnerInfo>
				</WinnerDiv>
				<Background>
					<span/>
					<span/>
					<span/>
					<span/>
					<span/>
					<span/>
					<span/>
					<span/>
				</Background>
			</WinnerContainer>
			<TournamentOverview>
				<button id='leave-button' onClick={handleLeave}>{t('game.tournaments.endPage.leaveButton')}</button>
				<TournamentHeader>
					<h1>{t('game.tournaments.endPage.overview.title')}</h1>
					<h2>{tournament.name} - {tournament.isPublic ? t('game.tournaments.endPage.overview.public') : t('game.tournaments.endPage.overview.private')}</h2>
				</TournamentHeader>
				<Tabs
					defaultActiveKey="matches"
					className="mb-3"
				>
					<Tab eventKey="matches" title={t('game.tournaments.endPage.overview.matches.title')}>
						<MatchCardTable>
							<thead>
								<tr>
									<th>{t('game.tournaments.endPage.overview.matches.columns.round')}</th>
									<th colSpan={2}>{t('game.tournaments.endPage.overview.matches.columns.players')}</th>
									<th>{t('game.tournaments.endPage.overview.matches.columns.duration')}</th>
									<th>{t('game.tournaments.endPage.overview.matches.columns.scores')}</th>
								</tr>
							</thead>
							<tbody>
								{matches.map((match, index) => renderMatch(match, index))}
							</tbody>
						</MatchCardTable>
					</Tab>
					<Tab eventKey="stats" title="Stats">
						<TournamentStats totalScores={totalScores}/>
					</Tab>
				</Tabs>
			</TournamentOverview>
		</EndTournamentContainer>
	);
};

export default EndedTournament;
