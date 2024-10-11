import React from "react";
import { Profile, ProfileImage, ProfileName } from "./styles/Game.styled";
import Spinner from "react-bootstrap/Spinner";

const GameProfile = ({ side, playerSide, player, opponent }) => {
	return (
		<Profile>
			{playerSide === side ? (
					player ? (
						<>
							<ProfileImage src={player.avatarID} alt={`${player.username}'s avatar`}/>
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
							<ProfileImage src={opponent.avatarID} alt={`${opponent.username}'s avatar`}/>
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
