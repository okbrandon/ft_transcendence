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
			))}
		</FriendsListContainer>
	);
};

export default FriendsList;
