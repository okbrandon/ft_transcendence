import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AvailableTournamentsSection,
	AvailableTournamentsContainer,
	SearchBar,
	TournamentList,
	TournamentCard,
	JoinButton,
} from "../../../styles/Game/Tournament/AvailableTournaments.styled";
import { BackButton } from "../../../styles/Game/Tournament/Tournament.styled";

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

	const filteredTournaments = tournaments.filter((tournament) =>
		tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<AvailableTournamentsSection>
			<BackButton onClick={() => setOptions('')}><i className="bi bi-arrow-left"/></BackButton>
			<AvailableTournamentsContainer>
				<SearchBar
					type="text"
					placeholder="Search for a tournament..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<TournamentList>
					{filteredTournaments.map((tournament) => (
						<TournamentCard key={tournament.id} onClick={() => navigate('/tournament-room')}>
							<h3>{tournament.name}</h3>
							<p>Players: {tournament.players}</p>
							<JoinButton>Join</JoinButton>
						</TournamentCard>
					))}
				</TournamentList>
			</AvailableTournamentsContainer>
		</AvailableTournamentsSection>
	);
};

export default AvailableTournaments;
