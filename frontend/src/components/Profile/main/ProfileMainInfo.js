import React, { useEffect, useState } from 'react';
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

const ProfilePicture = ({ user, profileUser, relation }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { setFriends, setRelations, setIsRefetch } = useRelation();
	const [loading, setLoading] = useState(false);
	const disableAddFriend = !!(relation.length &&
		((relation[0].sender.userID === user.userID && relation[0].status === 0)
		|| relation[0].status !== 0));
	const disableBlockUser = !!(relation.length && relation[0].status === 2);

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	const handleAddFriend = () => {
		if (loading) return;
		setLoading(true);
		if (relation.length && relation[0].status === 0) {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 1 })
				.then(() => {
					addNotification('success', 'You are now friends.');
					setIsRefetch(true);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		} else {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 0 })
				.then(() => {
					addNotification('success', 'Friend request sent.');
					setIsRefetch(true);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				});
		}
	};

	const handleRemoveFriend = () => {
		if (loading) return;
		setLoading(true);
		API.delete(`users/@me/relationships/${relation[0].relationshipID}`)
			.then(() => {
				addNotification('success', 'Friend removed.');
				setRelations(prevRelations => prevRelations.filter(prevRelation => prevRelation.relationshipID !== relation[0].relationshipID));
				setFriends(prevFriends => prevFriends.filter(friend => friend.relationshipID !== relation[0].relationshipID));
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	const handleBlockUser = () => {
		if (loading) return;
		setLoading(true);
		API.put('users/@me/relationships', { user: profileUser.userID, type: 2 })
			.then(() => {
				addNotification('warning', 'User blocked.');
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	}

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
								Settings
							</ActionButton>
						</ActionsContainer>
					) : (
						<ActionsContainer>
							<ActionButton
								type="button"
								onClick={handleBlockUser}
								disabled={disableBlockUser || loading}
							>
								<i className="bi bi-ban"/>
								Block
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
											{relation[0].status === 0 ? 'Cancel Request' : 'Remove Friend'}
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
									Add Friend
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
