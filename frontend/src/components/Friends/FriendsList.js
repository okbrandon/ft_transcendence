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
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const FriendsList = ({ friends, setIsRefetch }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { t } = useTranslation();

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

	const handleProfile = username => {
		navigate(`/profile/${username}`)
	};

	const handleRemove = relationID => {
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				addNotification("success", "Friend removed");
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification("error", `${err?.response?.data?.error || "An error occurred."}`);
			});
	};

	return (
		<ListContainer>
			{friends.length ? (
				friends.map((friend, key) => (
					<ListCard key={key}>
						<ProfileInfo onClick={() => handleProfile(friend.username)}>
							<ProfileStatus $status={friend.status?.online || false}/>
							<ProfileAvatar src={friend.avatarID} alt={`${friend.username}'s avatar`}/>
							<ProfileInfoContainer>
								{friend.displayName}
								<ProfileActivity>{setActivityDescription(friend.status?.activity)}</ProfileActivity>
							</ProfileInfoContainer>
						</ProfileInfo>
						<Actions>
							<PongButton type="button">{t('friends.subSections.friendList.inviteButton')}</PongButton>
							<PongButton type="button">{t('friends.subSections.friendList.messageButton')}</PongButton>
							<PongButton
								type="button"
								$backgroundColor="#ff5555"
								onClick={() => handleRemove(friend.relationID)}
							>
								{t('friends.subSections.friendList.deleteButton')}
							</PongButton>
						</Actions>
					</ListCard>
				))
			) : (
				<NoRelation>{t('friends.subSections.friendList.noResults')}</NoRelation>
			)}
		</ListContainer>
	);
};

export default FriendsList;
