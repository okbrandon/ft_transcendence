import React from "react";
import { useNavigate } from "react-router-dom";
import {
	ActionButton,
	Actions,
	FriendAvatar,
	FriendCard,
	FriendInfo,
	FriendName,
	FriendStatus,
	FriendsListContainer,
	RemoveButton
} from "./styles/FriendsList.styled";

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
			{friends.map((relation, key) => (
				<FriendCard key={key}>
					<FriendInfo onClick={() => handleProfile(relation.username)}>
						<FriendStatus $status={true} />
						<FriendAvatar src={relation.avatarID  && relation.avatarID !== 'default' ? relation.avatarID : '/images/default-profile.png'} alt={`${relation.displayName}'s avatar`}/>
						<FriendName>{relation.displayName}</FriendName>
					</FriendInfo>
					<Actions>
						<ActionButton>Invite</ActionButton>
						<ActionButton>Message</ActionButton>
						<RemoveButton type="button" onClick={() => handleRemove(relation)}>Remove</RemoveButton>
					</Actions>
				</FriendCard>
			))}
		</FriendsListContainer>
	);
};

export default FriendsList;
