import React, { useEffect, useState } from "react";
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
import { useRelation } from "../../context/RelationContext";

const RequestsList = ({ requests }) => {
	const navigate = useNavigate();
	const { setRelations, setRequests, setIsRefetch } = useRelation();
	const { addNotification } = useNotification();
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	const handleAccept = focusedRequest => {
		if (loading) return;
		setLoading(true);
		API.put('users/@me/relationships', { user: focusedRequest.userID, type: 1 })
			.then(() => {
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	const handleDecline = id => {
		if (loading) return;
		setLoading(true);
		API.delete(`users/@me/relationships/${id}`)
			.then(() => {
				setRelations(prevRelations => prevRelations.filter(relation => relation.relationshipID !== id));
				setRequests(prevRequests => prevRequests.filter(request => request.relationshipID !== id));
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
								<ProfileAvatar src={request.avatarID} alt={`${request.username}'s avatar`}/>
								{request.displayName}
						</ProfileInfo>
						{request.is === 'sender' ? (
							<Actions>
								<PongButton onClick={() => handleAccept(request)}>{t('friends.subSections.friendRequests.acceptButton')}</PongButton>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationshipID)}>{t('friends.subSections.friendRequests.declineButton')}</PongButton>
							</Actions>
						) : (
							<Actions>
								<PongButton $backgroundColor='#ff5555' onClick={() => handleDecline(request.relationshipID)}>{t('friends.subSections.friendRequests.cancelButton')}</PongButton>
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
