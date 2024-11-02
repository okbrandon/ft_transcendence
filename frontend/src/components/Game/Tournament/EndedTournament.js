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
	LeaveButtonContainer,
} from '../styles/Tournament/EndedTournament.styled';
import { useTournament } from '../../../context/TournamentContext';
import Loader from '../../../styles/shared/Loader.styled';
import TournamentStats from './TournamentStats';
import Confetti from 'react-confetti';

const EndedTournament = () => {
	const navigate = useNavigate();
	const { endTournamentData, tournament } = useTournament();
	const [matches, setMatches] = useState(null);
	const [totalScores, setTotalScores] = useState(null);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (!endTournamentData) return;
		setMatches(endTournamentData.matches.map(formatMatchData));
	}, [endTournamentData]);

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
		)
	}

	const handleProfileClick = username => {
		window.scrollTo(0, 0);
		navigate(`/profile/${username}`);
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
					<h2>WINNER</h2>
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
				<LeaveButtonContainer
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<i className={`bi bi-door-${isHovered ? 'open' : 'closed'}-fill`} onClick={() => navigate('/playmenu')}/>
				</LeaveButtonContainer>
				<TournamentHeader>
					<h1>Overview</h1>
					<h2>{tournament.name} - {tournament.isPublic ? 'Public' : 'Private'} tournament</h2>
				</TournamentHeader>
				<MatchCardTable>
					<thead>
						<tr>
							<th>round</th>
							<th colSpan={2}>players</th>
							<th>Duration</th>
							<th>Scores</th>
						</tr>
					</thead>
					<tbody>
						{matches.map((match, index) => renderMatch(match, index))}
					</tbody>
				</MatchCardTable>
				<TournamentStats totalScores={totalScores}/>
			</TournamentOverview>
		</EndTournamentContainer>
	);
};

export default EndedTournament;
