import React from 'react';
import { ProfileImage, ProfilePictureContainer, SectionContainer } from '../styles/main/ProfilePicture.styled';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import API from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { IconButton, IconsContainer } from '../styles/main/MainBar.styled';

const ProfilePicture = ({ profileUser, relation, setIsRefetch }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const disableAddFriend = !!relation.length;
	const disableBlockUser = !!(relation.length && relation[0].status === 2);
	const userID = localStorage.getItem('userID');

	const handleAddFriend = () => {
		if (relation.length && relation[0].status === 0) {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 1 })
				.then(() => {
					addNotification('success', 'Friend request sent.');
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
						value={20}
						strokeWidth={4}
						styles={buildStyles({
							rotation: 0.5,
							pathColor: `#FFD700`,
							trailColor: 'rgba(255,255,255,0.4)',
						})}
					/>
				</div>
				<p>0</p>
			</ProfilePictureContainer>
			<div>
				<h2>{profileUser.displayName}</h2>
				<div>
					{userID === profileUser.userID ? (
						<IconsContainer>
							<IconButton type="button" onClick={() => navigate('/settings')}>
								<i className="bi bi-gear-fill"/>
							</IconButton>
						</IconsContainer>
					) : (
						<IconsContainer>
							<IconButton
								type="button"
								onClick={handleBlockUser}
								disabled={disableBlockUser}
							>
								<i className="bi bi-ban"/>
							</IconButton>
							<IconButton
								type="button"
								onClick={handleAddFriend}
								disabled={disableAddFriend}
							>
								<i className="bi bi-person-fill-add"/>
							</IconButton>
						</IconsContainer>
					)}
				</div>
			</div>
		</SectionContainer>
	);
};

export default ProfilePicture;
