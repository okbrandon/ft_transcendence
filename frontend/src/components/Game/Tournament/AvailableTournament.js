import React, { useState } from "react";
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

const initialTournaments = [
	{ id: 1, name: "Summer Cup", players: "5/8" },
	{ id: 2, name: "Winter Clash", players: "6/8" },
	{ id: 3, name: "Pro League", players: "8/8" },
	{ id: 4, name: "Fun Tournament", players: "3/8" },
	{ id: 5, name: "Hanmin", players: "5/8" },
	{ id: 6, name: "Doomin", players: "6/8" },
	{ id: 7, name: "No", players: "8/8" },
	{ id: 8, name: "Yes", players: "3/8" },
	{ id: 9, name: "Pro Valo", players: "8/8" },
];

const AvailableTournaments = ({ setOptions }) => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [tournaments, setTournaments] = useState(initialTournaments);

	// Filter tournaments based on search input
	const filteredTournaments = tournaments.filter((tournament) =>
		tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleJoinTournament = (tournamentName) => {
		// Logic to handle joining a tournament (e.g., API call)
		// After joining, you can redirect the user to a confirmation page or tournament room
		navigate("/tournament-room");
	};

	return (
		<AvailableTournamentsSection>
			<Title>Available Tournaments</Title>
			<SearchContainer>
				<BackButton onClick={() => navigate(-1)}><i class="bi bi-arrow-left"/></BackButton>
				<SearchBar
					type="text"
					placeholder="Search for a tournament..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</SearchContainer>
			<AvailableTournamentsContainer>
				<TournamentList>
					{filteredTournaments.map((tournament) => (
						<TournamentCard key={tournament.id}>
							<h3>{tournament.name}</h3>
							<p>Players: {tournament.players}</p>
							<PongButton onClick={() => handleJoinTournament(tournament.name)}>
								Join
							</PongButton>
						</TournamentCard>
					))}
				</TournamentList>
			</AvailableTournamentsContainer>
		</AvailableTournamentsSection>
	);
};

export default AvailableTournaments;
