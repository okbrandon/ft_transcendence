import React from "react";
import { Profile, ProfileImage, ProfileName } from "./styles/Game.styled";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

const GameProfile = ({ side, playerSide, player, opponent }) => {
	const { t } = useTranslation();

	return (
		<Profile>
			{playerSide === side ? (
					player ? (
						<>
							<ProfileImage src={player.avatarID} alt={`${player.username}'s avatar`}/>
							<ProfileName>{player.displayName}</ProfileName>
						</>
					) : (
						<>
							{t('game.remote.profiles.playerA.title')}
							<Spinner animation="border" size="sm"/>
						</>
					)
				) : (
					opponent ? (
						<>
							<ProfileImage src={opponent.avatarID} alt={`${opponent.username}'s avatar`}/>
							<ProfileName>{opponent.displayName}</ProfileName>
						</>
					) : (
						<>
							{t('game.remote.profiles.playerB.title')}
							<Spinner animation="border" size="sm"/>
						</>
					)
				)}
		</Profile>
	);
};

export default GameProfile;
