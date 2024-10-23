import React from "react";
import { OverlayContainer, RewardsContainer } from "../styles/Game.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import { useNavigate } from "react-router-dom";

const Rewards = ({ endGameData }) => {
	const navigate = useNavigate();

	return (
		<OverlayContainer>
			<h1>Game Over !</h1>
			<p>{endGameData.won ? 'You won' : 'You lost'}</p>
			<RewardsContainer>
				{endGameData.won ? (
					<>
						<p>
							<span className="label">Experience:</span>
							<span>{endGameData.rewards.winner.xp} xp</span>
						</p>
						<p>
							<span className="label">Money:</span>
							<span>{endGameData.rewards.winner.money} <i className="bi bi-coin"/></span>
						</p>
					</>
				) : (
					<>
						<p>
							<span className="label">Experience:</span>
							<span>{endGameData.rewards.loser.xp} xp</span>
						</p>
						<p>
							<span className="label">Money:</span>
							<span>{endGameData.rewards.loser.money} <i className="bi bi-coin"/></span>
						</p>
					</>
				)}
				<PongButton onClick={() => navigate('/playmenu')}>Go Back to Main Menu</PongButton>
			</RewardsContainer>
		</OverlayContainer>
	);
};

export default Rewards;
