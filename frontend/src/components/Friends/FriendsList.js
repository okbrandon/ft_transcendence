import React from "react";
import { useNavigate } from "react-router-dom";
import PongButton from "../../styles/shared/PongButton.styled";
import { ListCard, NoRelation, ProfileAvatar, ProfileInfo, ProfileName, ProfileStatus } from "./styles/Friends.styled";
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
					<ListCard key={key}>
						<ProfileInfo onClick={() => handleProfile(friend.username)}>
							<ProfileStatus $status={true} />
							<ProfileAvatar src={friend.avatarID} alt={`${friend.displayName}'s avatar`}/>
							<ProfileName>{friend.displayName}</ProfileName>
						</ProfileInfo>
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
					</ListCard>
				))
			) : (
				<NoRelation>No friends found</NoRelation>
			)}
		</ListContainer>
	);
};

export default FriendsList;
