import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useRelation } from "../../../context/RelationContext";
import {
	ActiveFriendContainer,
	ButtonContainer,
	FriendItem,
	FriendProfilePicture,
	JoinTournamentContainer,
	KickButton,
	ModalContainer,
	ModalOverlay,
	PageContainer,
	PlayerCard,
	PlayerList,
	WaitingMessage,
} from "../styles/Tournament/JoinTournament.styled";
import PongButton from "../../../styles/shared/PongButton.styled";

const players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7"];

const JoinTournament = () => {
	const navigate = useNavigate();
	const { friends } = useRelation();
	const [invite, setInvite] = useState(false);
	const [activeFriends, setActiveFriends] = useState([]);
	const [isStartDisabled, setIsStartDisabled] = useState(true);

	useEffect(() => {
		setIsStartDisabled(players.length < 8);
	}, [setIsStartDisabled]);

	useEffect(() => {
		setActiveFriends(friends.filter(friend => !!friend.status.online));
	}, [friends]);

	const handleKickPlayer = playerName => {
		console.log(`Kicking ${playerName}`);
	};

	const handleInvite = () => {
		console.log("Inviting players...");
		setInvite(true);
	};

	// const handleFriendSelect = friendId => {
	// 	if (activeFriends.includes(friendId)) {
	// 		setActiveFriends((prevSelected) => prevSelected.filter((id) => id !== friendId));
	// 	} else {
	// 		setActiveFriends((prevSelected) => [...prevSelected, friendId]);
	// 	}
	// };

	return (
		<>
			<PageContainer>
				<h1>Tournament</h1>
				<h2>someone's room</h2>
				<JoinTournamentContainer>
					<PlayerList>
						{players.map((player, index) => (
							<PlayerCard key={index}>
								{player}
								<KickButton onClick={() => handleKickPlayer(player)}>✖</KickButton>
							</PlayerCard>
						))}
					</PlayerList>
					<ButtonContainer>
						<PongButton type="button" $width="150px" onClick={() => navigate(-1)}>Back</PongButton>
						<PongButton type="button" $width="150px" onClick={handleInvite}>Invite</PongButton>
						<PongButton type="button" $width="150px" disabled={isStartDisabled}>Start</PongButton>
					</ButtonContainer>
					<WaitingMessage>
						{isStartDisabled ? (
							<>
								<p>Waiting for more players to join...</p>
								<Spinner animation="border" />
							</>
						) : (
							<p>Ready to start!</p>
						)}
					</WaitingMessage>
				</JoinTournamentContainer>
			</PageContainer>
			{invite && (
				<ModalOverlay>
					<ModalContainer>
						<h2>Invite Friends</h2>
						<ActiveFriendContainer>
							{activeFriends.length ? (
								activeFriends.map((friend) => (
									<FriendItem key={friend.userID}>
										<FriendProfilePicture src={friend.avatarID} alt={`${friend.displayName}'s avatar`} />
										{friend.displayName}
									</FriendItem>
								))
							) : (
								<p>No active friends available to invite</p>
							)}
						</ActiveFriendContainer>
						<ButtonContainer>
							<PongButton type="button" $width="150px" onClick={() => setInvite(false)}>
								Cancel
							</PongButton>
							<PongButton type="button" $width="150px">
								Invite
							</PongButton>
						</ButtonContainer>
					</ModalContainer>
				</ModalOverlay>
			)}
		</>
	);
};

export default JoinTournament;
