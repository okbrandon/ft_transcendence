import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Actions,
	FriendAvatar,
	FriendCard,
	FriendInfo,
	FriendName,
	FriendStatus,
	ListContainer,
} from "./styles/FriendsList.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import { NoRelation } from "./styles/Friends.styled";
import API from "../../api/api";

const FriendsList = ({ friends, setFriends }) => {
	const navigate = useNavigate();

	const handleProfile = (username) => {
		navigate(`/profile/${username}`)
	};

	const handleRemove = (relationID) => {
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				setFriends(friends.filter(friend => friend.relationID !== relationID));
			})
			.catch(err => {
				console.error(err.response?.data?.error || 'An error occurred');
			});
	};

	return (
		<ListContainer>
			{friends.length ? (
				friends.map((friend, key) => (
					<FriendCard key={key}>
						<FriendInfo onClick={() => handleProfile(friend.username)}>
							<FriendStatus $status={true} />
							<FriendAvatar src={friend.avatarID} alt={`${friend.displayName}'s avatar`}/>
							<FriendName>{friend.displayName}</FriendName>
						</FriendInfo>
						<Actions>
							<PongButton type="button">Invite</PongButton>
							<PongButton type="button">Message</PongButton>
							<PongButton
								type="button"
								$backgroundColor="#ff5555"
								onClick={() => handleRemove(friend.relationID)}
							>
								Remove
							</PongButton>
						</Actions>
					</FriendCard>
				))
			) : (
				<NoRelation>No friends found</NoRelation>
			)}
		</ListContainer>
	);
};

export default FriendsList;
