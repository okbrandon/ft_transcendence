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

const AvailableTournaments = ({ setOptions }) => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [tournaments, setTournaments] = useState([]);
	const { registerForTournament } = useTournament();

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
				registerForTournament(tournamentID);
				navigate(`/tournaments/${tournamentID}`);
			} else {
				// For private tournaments, we might need to handle invites differently
				console.log("This is a private tournament. Invite handling not implemented.");
			}
		} catch (error) {
			console.error("Error joining tournament:", error);
			// Handle errors (e.g., tournament full, already joined, etc.)
		}
	};

	return (
		<AvailableTournamentsSection>
			<Title>Available Tournaments</Title>
			<SearchContainer>
				<BackButton onClick={() => navigate(-1)}><i className="bi bi-arrow-left"/></BackButton>
				<SearchBar
					id="search-tournament"
					type="text"
					placeholder="Search for a tournament..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</SearchContainer>
			<AvailableTournamentsContainer>
				<TournamentList>
					{filteredTournaments.map((tournament) => (
						<TournamentCard key={tournament.tournamentID}>
							<h3>{tournament.name}</h3>
							<p>Players: {tournament.participants.length}/{tournament.maxParticipants}</p>
							<p>Status: {tournament.status}</p>
							{tournament.status === 'PENDING' && (
								<PongButton onClick={() => handleJoinTournament(tournament.tournamentID)}>
									Join
								</PongButton>
							)}
						</TournamentCard>
					))}
				</TournamentList>
			</AvailableTournamentsContainer>
		</AvailableTournamentsSection>
	);
};

export default AvailableTournaments;