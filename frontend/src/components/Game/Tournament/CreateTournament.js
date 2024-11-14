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
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useTournament } from "../../../context/TournamentContext";
import { useNotification } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";

const CreateTournament = ({ setOptions }) => {
	const { addNotification } = useNotification();
	const { user } = useAuth();
	const [tournamentName, setTournamentName] = useState("");
	const [maxParticipants, setMaxParticipants] = useState(4);
	const [isPublic, setIsPublic] = useState(true);
	const navigate = useNavigate();
	const { registerForTournament } = useTournament();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await API.post('/tournaments', {
				name: tournamentName,
				isPublic: isPublic,
				maxParticipants: maxParticipants
			});
			console.log('CreateTournament: tournament created');
			console.log('CreateTournament:', user.tournamentID);
			registerForTournament(response.data.tournamentID);
			navigate(`/tournaments/${response.data.tournamentID}`);
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error creating tournament');
		}
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
						maxLength={16}
						value={tournamentName}
						onChange={(e) => setTournamentName(e.target.value)}
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor="max-participants">Max Participants:</FormLabel>
					<FormSelect
						id="max-participants"
						value={maxParticipants}
						onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
					>
						<option value="4">4</option>
						<option value="6">6</option>
						<option value="8">8</option>
					</FormSelect>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor="is-public">Public Tournament:</FormLabel>
					<FormSelect
						id="is-public"
						value={isPublic}
						onChange={(e) => setIsPublic(e.target.value === 'true')}
					>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</FormSelect>
				</FormGroup>
				<PongButton type="submit" $width='100%'>CREATE</PongButton>
				<PongButton type="button" $width='100%' onClick={() => setOptions('')}>BACK</PongButton>
			</TournamentForm>
		</PageContainer>
	);
};

export default CreateTournament;
