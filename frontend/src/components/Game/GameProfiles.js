import React from "react";
import { PressQContainer, ProfilesContainer } from "./styles/Game.styled";
import GameProfile from "./GameProfile";

const GameProfiles = ({ player, opponent, playerSide }) => {
	return (
		<ProfilesContainer>
			<GameProfile
				side="left"
				playerSide={playerSide}
				player={player}
				opponent={opponent}
			/>
			<PressQContainer>
				<p>Press <b>Q</b> to quit game</p>
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
