import React from "react";
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

	return (
		<FriendsListContainer>
			{friends.map((friend) => (
				<FriendCard key={friend.id}>
					<FriendInfo>
						<FriendStatus $status={friend.status} />
						<FriendAvatar src="/images/anonymous.png" alt={`${friend.name}'s avatar`}/>
						<FriendName>{friend.name}</FriendName>
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
