import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Actions,
	FriendAvatar,
	FriendCard,
	FriendInfo,
	FriendName,
	FriendStatus,
	FriendsListContainer,
} from "./styles/FriendsList.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import { NoRelation } from "./styles/Friends.styled";

const FriendsList = ({ friends }) => {
	const navigate = useNavigate();

	const handleProfile = (username) => {
		navigate(`/profile/${username}`)
	};

	const handleRemove = (relation) => {
		// handleRemove logic here
	};

	return (
		<FriendsListContainer>
			{friends.length ? (
				friends.map((relation, key) => (
					<FriendCard key={key}>
						<FriendInfo onClick={() => handleProfile(relation.user.username)}>
							<FriendStatus $status={true} />
							<FriendAvatar src={relation.user.avatarID} alt={`${relation.user.displayName}'s avatar`}/>
							<FriendName>{relation.user.displayName}</FriendName>
						</FriendInfo>
						<Actions>
							<PongButton type="button">Invite</PongButton>
							<PongButton type="button">Message</PongButton>
							<PongButton
								type="button"
								$backgroundColor="#ff5555"
								onClick={() => handleRemove(relation)}
							>
								Remove
							</PongButton>
						</Actions>
					</FriendCard>
				))
			) : (
				<NoRelation>No friends found</NoRelation>
			)}
		</FriendsListContainer>
	);
};

export default FriendsList;
