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

	const handleProfileClick = (username) => {
		console.log('pass');
		navigate(`/profile/${username}`)
	};
	// handle remove

	return (
		<FriendsListContainer>
			{friends.map((relation, key) => (
				<FriendCard key={key}>
					<FriendInfo onClick={() => handleProfileClick(relation.username)}>
						<FriendStatus $status={true} />
						<FriendAvatar src={relation.avatarID ? relation.avatarID : '/images/default-profile.png'} alt={`${relation.displayName}'s avatar`}/>
						<FriendName>{relation.displayName}</FriendName>
					</FriendInfo>
					<Actions>
						<ActionButton>Invite</ActionButton>
						<ActionButton>Message</ActionButton>
						<RemoveButton id="remove-button">Remove</RemoveButton>
					</Actions>
				</FriendCard>
			))}
		</FriendsListContainer>
	);
};

export default FriendsList;
