import React from "react";
import { PressQContainer, ProfilesContainer } from "./styles/Game.styled";
import GameProfile from "./GameProfile";

const GameProfiles = ({ player, opponent, playerSide, isSpectator }) => {
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
					<p>You are spectating this game</p>
				) : (
					<p>Press <b>Q</b> to quit game</p>
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
