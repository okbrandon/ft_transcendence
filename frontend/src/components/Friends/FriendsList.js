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

	// handle remove

	return (
		<FriendsListContainer>
			{friends.map((relation, key) => (
				<FriendCard key={key}>
					<FriendInfo>
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
