import React from "react";
import { Profile, ProfileImage, ProfileName } from "./styles/Game.styled";
import Spinner from "react-bootstrap/Spinner";

const GameProfile = ({ side, playerSide, player, opponent }) => {
	return (
		<Profile>
			{playerSide === side ? (
					player ? (
						<>
							<ProfileImage src={player.avatarID} alt="Profile Picture"/>
							<ProfileName>{player.username}</ProfileName>
						</>
					) : (
						<>
							Waiting for player
							<Spinner animation="border" size="sm"/>
						</>
					)
				) : (
					opponent ? (
						<>
							<ProfileImage src={opponent.avatarID} alt="Profile Picture"/>
							<ProfileName>{opponent.username}</ProfileName>
						</>
					) : (
						<>
							Waiting for opponent
							<Spinner animation="border" size="sm"/>
						</>
					)
				)}
		</Profile>
	);
};

export default GameProfile;
