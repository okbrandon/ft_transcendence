import React, { useState } from "react";
import {
	PageContainer,
	TournamentForm
} from "../styles/Tournament/CreateTournament.styled";
import { BackButton } from "../styles/Tournament/Tournament.styled";

const CreateTournament = ({ setOptions }) => {
	const [maxPlayers, setMaxPlayers] = useState(4);
	const [maxRounds, setMaxRounds] = useState(3);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('CreateTournament: tournament submitted');
		// something to do with the api probably
	};

	return (
		<PageContainer>
			<BackButton onClick={() => setOptions('')}><i className="bi bi-arrow-left"/></BackButton>
			<h1>Tournament Setup</h1>
			<TournamentForm onSubmit={handleSubmit}>
				<TournamentForm.Group>
					<TournamentForm.Label htmlFor="tournament-name">Tournament Name</TournamentForm.Label>
					<TournamentForm.Control
						id="tournament-name"
						type="text"
						required
					/>
				</TournamentForm.Group>
				<TournamentForm.Group>
					<TournamentForm.Label htmlFor="players">Max Players:</TournamentForm.Label>
					<TournamentForm.Select
						id="players"
						defaultValue="4"
						onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
					>
						<option value="4">4</option>
						<option value="6">6</option>
						<option value="8">8</option>
					</TournamentForm.Select>
				</TournamentForm.Group>
				<TournamentForm.Group>
					<TournamentForm.Label htmlFor="rounds">Max Rounds:</TournamentForm.Label>
					<TournamentForm.Select
						id="rounds"
						defaultValue="3"
						onChange={(e) => setMaxRounds(parseInt(e.target.value))}
					>
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="7">7</option>
					</TournamentForm.Select>
				</TournamentForm.Group>
				<button type="submit">CREATE</button>
			</TournamentForm>
		</PageContainer>
	);
};

export default CreateTournament;
