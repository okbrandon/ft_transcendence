import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import PongButton from "../../styles/shared/PongButton.styled";
import {
	Actions,
	ListCard,
	ListContainer,
	NoRelation,
	ProfileActivity,
	ProfileAvatar,
	ProfileInfo,
	ProfileInfoContainer,
	ProfileStatus,
} from "./styles/Friends.styled";

const setActivityDescription = activity => {
	if (activity === "QUEUEING") {
		return "In queue";
	} else if (activity === "PLAYING_VS_AI") {
		return "Playing vs AI";
	} else if (activity === "HOME") {
		return "In lobby";
	}
	return "Touching grass...";
}

const FriendsList = ({ friends, setIsRefetch, setSendNotification }) => {
	const navigate = useNavigate();

	const handleProfile = username => {
		navigate(`/profile/${username}`)
	};

	const handleRemove = relationID => {
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				setSendNotification({ type: "success", message: "Friend removed" });
				setIsRefetch(true);
			})
			.catch(err => {
				setSendNotification({ type: "error", message: `${err?.response?.data?.error || "An error occurred."}` });
			});
	};

	return (
		<ListContainer>
			{friends.length ? (
				friends.map((friend, key) => (
					<ListCard key={key}>
						<ProfileInfo onClick={() => handleProfile(friend.username)}>
							<ProfileStatus $status={friend.status?.online || false}/>
							<ProfileAvatar src={friend.avatarID} alt={`${friend.displayName}'s avatar`}/>
							<ProfileInfoContainer>
								{friend.displayName}
								<ProfileActivity>{setActivityDescription(friend.status?.activity)}</ProfileActivity>
							</ProfileInfoContainer>
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
