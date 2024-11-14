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
import { useTranslation } from "react-i18next";

const CreateTournament = ({ setOptions }) => {
	const { addNotification } = useNotification();
	const { user } = useAuth();
	const [tournamentName, setTournamentName] = useState("");
	const [maxParticipants, setMaxParticipants] = useState(4);
	const [isPublic, setIsPublic] = useState(true);
	const navigate = useNavigate();
	const { registerForTournament } = useTournament();
	const { t } = useTranslation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await API.post('/tournaments', {
				name: tournamentName,
				isPublic,
				maxParticipants
			});
			registerForTournament(response.data.tournamentID);
			navigate(`/tournaments/${response.data.tournamentID}`);
		} catch (error) {
			addNotification('error', error.response?.data?.error || 'Error creating tournament');
		}
	};

	return (
		<PageContainer>
			<h1>{t('game.tournaments.setup.title')}</h1>
			<TournamentForm onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor="tournament-name">{t('game.tournaments.setup.subSections.name')}</FormLabel>
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
					<FormLabel htmlFor="max-participants">{t('game.tournaments.setup.subSections.maxPlayers')}</FormLabel>
					<FormSelect
						id="max-participants"
						value={maxParticipants}
						onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
					>
						<option value="4">4</option>
						<option value="8">8</option>
					</FormSelect>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor="is-public">{t('game.tournaments.setup.subSections.isPublic.title')}</FormLabel>
					<FormSelect
						id="is-public"
						value={isPublic}
						onChange={(e) => setIsPublic(e.target.value === 'true')}
					>
						<option value="true">{t('game.tournaments.setup.subSections.isPublic.yes')}</option>
						<option value="false">{t('game.tournaments.setup.subSections.isPublic.no')}</option>
					</FormSelect>
				</FormGroup>
				<PongButton type="submit" $width='100%'>{t('game.tournaments.setup.createButton')}</PongButton>
				<PongButton type="button" $width='100%' onClick={() => setOptions('')}>{t('game.tournaments.setup.backButton')}</PongButton>
			</TournamentForm>
		</PageContainer>
	);
};

export default CreateTournament;
