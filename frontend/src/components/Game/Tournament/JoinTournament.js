import React from "react";
import { useNavigate } from "react-router-dom";
import {
	InviteButton,
	JoinTournamentContainer,
	KickButton,
	PageContainer,
	PlayerCard,
	PlayerList,
	WaitingMessage,
} from "../../../styles/Game/Tournament/JoinTournament.styled";
import Spinner from "react-bootstrap/Spinner";
import { BackButton } from "../../../styles/Game/Tournament/Tournament.styled";

const players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7"];

const JoinTournament = () => {
	const navigate = useNavigate();
	const isStartDisabled = players.length < 8;

	const handleKickPlayer = (playerName) => {
		console.log(`Kicking ${playerName}`);
	};

	return (
		<PageContainer>
			<JoinTournamentContainer>
				<BackButton onClick={() => navigate('/tournament')}>
					<i className="bi bi-arrow-left"/>
				</BackButton>
				<h1>Tournament</h1>
				<h2>someone's room</h2>
				<PlayerList>
					{players.map((player, index) => (
						<PlayerCard key={index}>
							{player}
							<KickButton onClick={() => handleKickPlayer(player)}>✖</KickButton>
						</PlayerCard>
					))}
				</PlayerList>
				<InviteButton>Invite Players</InviteButton>
				<WaitingMessage>
					{isStartDisabled ? (
						<>
							<p>Waiting for more players to join...</p>
							<Spinner animation="border" />
						</>
					) : (
						<p>Ready to start!</p>
					)}
				</WaitingMessage>
			</JoinTournamentContainer>
		</PageContainer>
	);
};

export default JoinTournament;
