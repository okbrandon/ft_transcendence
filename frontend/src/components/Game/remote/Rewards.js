import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { OverlayContainer, RewardsContainer } from "../styles/Game.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import Card from "../../../styles/shared/Card.styled";
import { useTranslation } from "react-i18next";

const Rewards = ({ endGameData, isSpectator = false, isTournament }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { t } = useTranslation();

	return (
		<OverlayContainer>
			<h1>{t('game.gameOver')}</h1>
			{isSpectator ? (
				<Card $width="250px" $height="190px">
					<div className="bg">
						<img src={endGameData.winnerProfile.avatarID} alt={`${endGameData.winnerProfile.displayName}'s avatar`}/>
						{t('game.remote.winner.title', { username: `${endGameData.winnerProfile.displayName}` })}
					</div>
					<div className="blob"/>
				</Card>
			) : (
				<>
					<p>{endGameData.winner === user.userID ? t('game.remote.winner.subTitle') : t('game.remote.loser.subTitle')}</p>
					<RewardsContainer>
						{endGameData.winner === user.userID ? (
							<>
								<p>
									<span className="label">{t('game.remote.rewards.experience.title')}</span>
									<span>{t('game.remote.rewards.experience.amount', { amount: `${endGameData.rewards.winner.xp}` })}</span>
								</p>
								<p>
									<span className="label">{t('game.remote.rewards.money.title')}</span>
									<span>{t('game.remote.rewards.money.amount', { amount: `${endGameData.rewards.winner.xp}` })}</span>
								</p>
							</>
						) : (
							<>
								<p>
									<span className="label">{t('game.remote.rewards.experience.title')}</span>
									<span>{t('game.remote.rewards.experience.amount', { amount: `${endGameData.rewards.loser.xp}` })}</span>
								</p>
								<p>
									<span className="label">{t('game.remote.rewards.money.title')}</span>
									<span>{t('game.remote.rewards.money.amount', { amount: `${endGameData.rewards.loser.xp}` })}</span>
								</p>
							</>
						)}
					</RewardsContainer>
				</>
			)}
			{!isTournament && (
				<PongButton onClick={() => navigate('/playmenu')}>{t('game.leave.button')}</PongButton>
			)}
		</OverlayContainer>
	);
};

export default Rewards;
