import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import PongButton from "../../styles/shared/PongButton.styled";
import {
	Actions,
	ListCard,
	ListContainer,
	NoRelation,
	ProfileAvatar,
	ProfileInfo
} from "./styles/Friends.styled";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const RequestsList = ({ requests, setIsRefetch }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { t } = useTranslation();

	const handleAccept = focusedRequest => {
		API.put('users/@me/relationships', { user: focusedRequest.userID, type: 1 })
			.then(() => {
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	const handleDecline = id => {
		API.delete(`users/@me/relationships/${id}`)
			.then(() => {
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	const handleProfile = username => {
		navigate(`/profile/${username}`);
	};

	return (
		<ListContainer>
			{requests.length ? (
				requests.map((request, key) => (
					<ListCard key={key}>
						<ProfileInfo onClick={() => handleProfile(request.username)}>
								<ProfileAvatar src={request.avatarID} alt={`${request.displayName}'s avatar`}/>
								{request.displayName}
						</ProfileInfo>
						{request.is === 'sender' ? (
							<Actions>
								<PongButton onClick={() => handleAccept(request)}>{t('friends.subSections.friendRequests.acceptButton')}</PongButton>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationID)}>{t('friends.subSections.friendRequests.declineButton')}</PongButton>
							</Actions>
						) : (
							<Actions>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationID)}>{t('friends.subSections.friendRequests.cancelButton')}</PongButton>
							</Actions>
						)}
					</ListCard>
				))
			) : (
				<NoRelation>{t('friends.subSections.friendRequests.noResults')}</NoRelation>
			)}
		</ListContainer>
	);
};

export default RequestsList;
