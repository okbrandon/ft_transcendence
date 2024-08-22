import React from "react";
import {
	InviteButton,
	JoinTournamentContainer,
	KickButton,
	PlayerCard,
	PlayerList,
	WaitingMessage } from "../../../styles/Game/Tournament/JoinTournament.styled";
import Spinner from "react-bootstrap/Spinner";
import { BackButton } from "../../../styles/Game/Tournament/Tournament.styled";

const players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7"];

const JoinTournament = ({ setOptions }) => {
	const isStartDisabled = players.length < 8;

	const handleKickPlayer = (playerName) => {
		console.log(`Kicking ${playerName}`);
	};

	return (
		<JoinTournamentContainer>
			<BackButton onClick={() => setOptions('')}><i className="bi bi-arrow-left"/></BackButton>
			<h1>Tournament</h1>
			<h2>something something</h2>
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
	);
};

export default JoinTournament;
