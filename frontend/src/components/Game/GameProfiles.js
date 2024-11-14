import React from "react";
import { PressQContainer, ProfilesContainer } from "./styles/Game.styled";
import GameProfile from "./GameProfile";
import { useTranslation, Trans } from "react-i18next";

const GameProfiles = ({ player, opponent, playerSide, isSpectator }) => {
	const { t } = useTranslation();

	return (
		<ProfilesContainer>
			<GameProfile
				side="left"
				playerSide={playerSide}
				player={player}
				opponent={opponent}
			/>
			<PressQContainer>
				{isSpectator ? (
					<p>{t('game.remote.profiles.spectator.title')}</p>
				) : (
					<p>
						<Trans i18nKey="game.leave.title" components={[<strong key="first"/>]} />
					</p>
				)}
			</PressQContainer>
			<GameProfile
				side="right"
				playerSide={playerSide}
				player={player}
				opponent={opponent}
			/>
		</ProfilesContainer>
	);
};

export default GameProfiles;
