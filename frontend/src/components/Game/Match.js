import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ButtonsContainer,
	PageContainer,
	PlayersContainer,
	VsAiContainer
} from "../../styles/Game/Match.styled";
import Spinner from "react-bootstrap/Spinner";

const Match = ({ roomId }) => {
	const navigate = useNavigate();
	const [player1, setPlayer1] = useState({ displayName: "TestPlayer1" });
	const [player2, setPlayer2] = useState(null);

	return (
		<PageContainer>
			<h1>Match</h1>
			<VsAiContainer>
				<PlayersContainer>
					<img src="/images/prune.jpg" alt="player1"/>
					<p>{player1.displayName}</p>
				</PlayersContainer>
				<p>VS</p>
				<PlayersContainer>
					{player2 ? (
						<>
							<img src="/images/prune.jpg" alt="player2"/>
							<p>TestPlayer2</p>
						</>
					) : (
						<>
							<p>Waiting for player</p>
							<Spinner animation="border"/>
						</>
					)}
				</PlayersContainer>
			</VsAiContainer>
			<ButtonsContainer>
				<button>Play</button>
				<button>Invite</button>
				<button onClick={() => navigate(-1)}>Leave</button>
			</ButtonsContainer>
		</PageContainer>
	);
};

export default Match;
