import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useNotification } from '../../../context/NotificationContext';
import API from '../../../api/api';
import {
	ActionButton,
	ActionsContainer,
	ProfileActionContainer,
	ProfileDisplayName,
	ProfileImage,
	ProfilePictureContainer,
	ProfileUsername,
	SectionContainer,
} from '../styles/main/ProfileMainInfo.styled';
import { useRelation } from '../../../context/RelationContext';
import { useTranslation } from 'react-i18next';

const ProfilePicture = ({ user, profileUser, relation }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { setFriends, setRelations, setIsRefetch } = useRelation();
	const [loading, setLoading] = useState(false);
	const disableAddFriend = !!(relation.length &&
		((relation[0].sender.userID === user.userID && relation[0].status === 0)
		|| relation[0].status !== 0));
	const disableBlockUser = !!(relation.length && relation[0].status === 2);
	const { t } = useTranslation();
	const tRef = useRef(t);

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	const handleAddFriend = useCallback(() => {
		if (loading) return;
		setLoading(true);
		if (relation.length && relation[0].status === 0) {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 1 })
				.then(() => {
					addNotification('success', tRef.current('friends.notifications.friendAccepted'));
					setIsRefetch(true);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		} else if (profileUser.userID === 'user_ai') {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 1 })
				.then(() => {
					addNotification('success', tRef.current('friends.notifications.pruneAccepted'));
					setIsRefetch(true);
					setFriends(prevFriends => [...prevFriends, { userID: profileUser.userID, username: profileUser.username, status: 1 }]);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		} else {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 0 })
				.then(() => {
					addNotification('success', tRef.current('friends.notifications.friendRequestSent'));
					setIsRefetch(true);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		}
	}, [addNotification, profileUser, relation, setIsRefetch, loading, setFriends]);

	const handleRemoveFriend = useCallback(() => {
		if (loading) return;
		setLoading(true);
		API.delete(`users/@me/relationships/${relation[0].relationshipID}`)
			.then(() => {
				addNotification('success', tRef.current('friends.notifications.friendRemoved'));
				setRelations(prevRelations => prevRelations.filter(prevRelation => prevRelation.relationshipID !== relation[0].relationshipID));
				setFriends(prevFriends => prevFriends.filter(friend => friend.relationshipID !== relation[0].relationshipID));
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	}, [addNotification, relation, setFriends, setRelations, loading]);

	const handleBlockUser = useCallback(() => {
		if (loading) return;
		setLoading(true);
		API.put('users/@me/relationships', { user: profileUser.userID, type: 2 })
			.then(() => {
				addNotification('warning', tRef.current('friends.notifications.userBlocked'));
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	}, [addNotification, profileUser.userID, setIsRefetch, loading]);

	return (
		<SectionContainer>
			<ProfilePictureContainer>
				<ProfileImage
					src={profileUser.avatarID}
					alt={`${profileUser.username}'s avatar`}
					roundedCircle
				/>
				<div>
					<CircularProgressbar
						value={profileUser.xp % 1000 / 1000 * 100}
						strokeWidth={5}
						styles={buildStyles({
							rotation: 0.5,
							pathColor: 'rgba(164, 69, 178, 1)',
							trailColor: 'rgba(220, 220, 220, 1)',
						})}
					/>
				</div>
				<p>{Math.floor(profileUser.xp / 1000)}</p>
			</ProfilePictureContainer>
			<ProfileActionContainer>
				<ProfileUsername>{profileUser.displayName}</ProfileUsername>
				<ProfileDisplayName>{profileUser.username}</ProfileDisplayName>
				<div>
					{profileUser.username === user.username ? (
						<ActionsContainer>
							<ActionButton type="button" onClick={() => navigate('/settings')}>
								<i className="bi bi-gear-fill"/>
								{t('header.profileButton.settings')}
							</ActionButton>
						</ActionsContainer>
					) : profileUser.userID === 'user_ai' ? (
						<ActionsContainer>
							{/* No buttons for AI user */}
						</ActionsContainer>
					) : (
						<ActionsContainer>
							<ActionButton
								type="button"
								onClick={handleBlockUser}
								disabled={disableBlockUser || loading}
							>
								<i className="bi bi-ban"/>
								{t('chat.block.title')}
							</ActionButton>
							{disableAddFriend ? (
								<ActionButton
									type="button"
									onClick={handleRemoveFriend}
									disabled={loading}
								>
									{disableBlockUser ? (
										<>
											<i className="bi bi-bandaid"/>
											Cancel Block
										</>
									) : (
										<>
											<i className="bi bi-person-dash-fill"/>
											{relation[0].status === 0 ? t('friends.subSections.friendRequests.cancelButton') : t('friends.subSections.friendList.deleteButton')}
										</>
									)}
								</ActionButton>
							) : (
								<ActionButton
									type="button"
									onClick={handleAddFriend}
									disabled={loading}
								>
									<i className="bi bi-person-fill-add"/>
									{t('friends.subSections.friendList.addButton')}
								</ActionButton>
							)}
						</ActionsContainer>
					)}
				</div>
			</ProfileActionContainer>
		</SectionContainer>
	);
};

export default ProfilePicture;
