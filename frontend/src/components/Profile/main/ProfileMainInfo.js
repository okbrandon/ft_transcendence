import React from 'react';
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

const ProfilePicture = ({ user, profileUser, relation, setIsRefetch }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const disableAddFriend = !!(relation.length && relation[0].status !== 0);
	const disableBlockUser = !!(relation.length && relation[0].status === 2);

	const handleAddFriend = () => {
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
		API.delete(`users/@me/relationships/${relation[0].relationshipID}`)
			.then(() => {
				addNotification('success', 'Friend removed.');
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	const handleBlockUser = () => {
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
								disabled={disableBlockUser}
							>
								<i className="bi bi-ban"/>
								Block
							</ActionButton>
							{disableAddFriend ? (
								<ActionButton
									type="button"
									onClick={handleRemoveFriend}
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
