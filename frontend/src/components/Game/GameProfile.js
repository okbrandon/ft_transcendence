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
							<p>Waiting for player</p>
							<Spinner animation="border"/>
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
							<p>Waiting for opponent</p>
							<Spinner animation="border"/>
						</>
					)
				)}
		</Profile>
	);
};

export default GameProfile;
