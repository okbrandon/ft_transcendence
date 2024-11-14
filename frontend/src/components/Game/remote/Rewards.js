import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { OverlayContainer, RewardsContainer } from "../styles/Game.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import Card from "../../../styles/shared/Card.styled";

const Rewards = ({ endGameData, isSpectator = false, isTournament }) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	console.log('Rewards.js:', endGameData);

	return (
		<OverlayContainer>
			<h1>Game Over!</h1>
			{isSpectator ? (
				<Card $width="250px" $height="190px">
					<div className="bg">
						<img src={endGameData.winnerProfile.avatarID} alt={`${endGameData.winnerProfile.displayName}'s avatar`}/>
						{endGameData.winnerProfile.displayName} won !
					</div>
					<div className="blob"/>
				</Card>
			) : (
				<>
					<p>{endGameData.winner === user.userID ? 'You won!' : 'You lost.'}</p>
					<RewardsContainer>
						{endGameData.winner === user.userID ? (
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
					</RewardsContainer>
				</>
			)}
			{!isTournament && (
				<PongButton onClick={() => navigate('/playmenu')}>Go Back to Main Menu</PongButton>
			)}
		</OverlayContainer>
	);
};

export default Rewards;
