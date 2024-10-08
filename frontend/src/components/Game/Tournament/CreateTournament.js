import React, { useState } from "react";
import {
	FormControl,
	FormGroup,
	FormLabel,
	FormSelect,
	PageContainer,
	TournamentForm
} from "../styles/Tournament/CreateTournament.styled";
import PongButton from "../../../styles/shared/PongButton.styled";

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
			<h1>Tournament Setup</h1>
			<TournamentForm onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor="tournament-name">Tournament Name</FormLabel>
					<FormControl
						id="tournament-name"
						type="text"
						required
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor="players">Max Players:</FormLabel>
					<FormSelect
						id="players"
						value={maxPlayers}
						onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
					>
						<option value="4">4</option>
						<option value="6">6</option>
						<option value="8">8</option>
					</FormSelect>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor="rounds">Max Rounds:</FormLabel>
					<FormSelect
						id="rounds"
						value={maxRounds}
						onChange={(e) => setMaxRounds(parseInt(e.target.value))}
					>
						<option value="3">3</option>
						<option value="5">5</option>
						<option value="7">7</option>
					</FormSelect>
				</FormGroup>
				<PongButton type="submit" $width='100%'>CREATE</PongButton>
				<PongButton type="button" $width='100%' onClick={() => setOptions('')}>BACK</PongButton>
			</TournamentForm>
		</PageContainer>
	);
};

export default CreateTournament;
