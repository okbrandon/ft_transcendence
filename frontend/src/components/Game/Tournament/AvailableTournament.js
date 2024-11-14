import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	AvailableTournamentsContainer,
	AvailableTournamentsSection,
	SearchBar,
	SearchContainer,
	Title,
	TournamentCard,
	TournamentList,
	BackButton
} from "../styles/Tournament/AvailableTournaments.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import { useTournament } from "../../../context/TournamentContext";
import API from "../../../api/api";
import { useNotification } from "../../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const AvailableTournaments = ({ setOptions }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const [searchQuery, setSearchQuery] = useState("");
	const [tournaments, setTournaments] = useState([]);
	const { registerForTournament } = useTournament();
	const { t } = useTranslation();

	useEffect(() => {
		fetchTournaments();
	}, []);

	const fetchTournaments = async () => {
		try {
			const response = await API.get('/tournaments');
			setTournaments(response.data);
		} catch (error) {
			console.error("Error fetching tournaments:", error);
		}
	};

	// Filter tournaments based on search input
	const filteredTournaments = tournaments.filter((tournament) =>
		tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleJoinTournament = async (tournamentID) => {
		try {
			const response = await API.get(`/tournaments/${tournamentID}`);
			const tournament = response.data;

			if (tournament.isPublic) {
				await API.post(`/tournaments/${tournamentID}/join`);
				navigate(`/tournaments/${tournamentID}`);
				registerForTournament(tournamentID);
			}
		} catch (error) {
			addNotification("error", error.response?.data?.error || "Error joining tournament");
		}
	};

	return (
		<AvailableTournamentsSection>
			<Title>{t('game.tournaments.title')}</Title>
			<SearchContainer>
				<BackButton onClick={() => setOptions('')}><i className="bi bi-arrow-left"/></BackButton>
				<SearchBar
					id="search-tournament"
					type="text"
					placeholder={t('game.tournaments.searchBar.placeholder')}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</SearchContainer>
			<AvailableTournamentsContainer>
				<TournamentList>
					{tournaments.length ? filteredTournaments.map((tournament) => (
						<TournamentCard key={tournament.tournamentID}>
							<h3>{tournament.name}</h3>
							<p>{t('game.tournaments.listing.players', { players: `${tournament.participants.length}`, maxPlayers: `${tournament.maxParticipants}` })}</p>
							<p>{t('game.tournaments.listing.status', { status: `${tournament.status}`})}</p>
							{tournament.status === 'PENDING' && (
								<PongButton onClick={() => handleJoinTournament(tournament.tournamentID)}>
									{t('game.tournaments.listing.joinButton')}
								</PongButton>
							)}
						</TournamentCard>
					)) : (
						<p>{t('game.tournaments.listing.noTournaments')}</p>
					)}
				</TournamentList>
			</AvailableTournamentsContainer>
		</AvailableTournamentsSection>
	);
};

export default AvailableTournaments;
