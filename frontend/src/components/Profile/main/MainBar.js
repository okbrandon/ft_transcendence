import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import MainStats from './MainStats';
import API from '../../../api/api';
import {
	IconButton,
	IconsContainer,
	MainBarContainer,
	SectionContainer
} from '../styles/main/MainBar.styled';
import 'react-circular-progressbar/dist/styles.css';

const MainBar = ({ profileUser, matchArray, relation, setIsRefetch, setSendNotification }) => {
	const navigate = useNavigate();
	const disableAddFriend = !!relation.length;
	const disableBlockUser = !!(relation.length && relation[0].status === 2);
	const userID = localStorage.getItem('userID');

	const handleAddFriend = () => {
		if (relation.length && relation[0].status === 0) {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 1 })
				.then(() => {
					setSendNotification({ type: 'success', message: 'Friend request sent.' });
					setIsRefetch(true);
				})
				.catch(err => {
					setSendNotification({ type: 'error', message: `${err?.response?.data?.error || 'An error occurred.'}` });
				});
		} else {
			API.put('users/@me/relationships', { user: profileUser.userID, type: 0 })
				.then(() => {
					setSendNotification({ type: 'success', message: 'Friend request sent.' });
					setIsRefetch(true);
				})
				.catch(err => {
					setSendNotification({ type: 'error', message: `${err?.response?.data?.error || 'An error occurred.'}` });
				});
		}
	};

	const handleBlockUser = () => {
		API.put('users/@me/relationships', { user: profileUser.userID, type: 2 })
			.then(() => {
				setSendNotification({ type: 'warning', message: 'User blocked.' });
				setIsRefetch(true);
			})
			.catch(err => {
				setSendNotification({ type: 'error', message: `${err?.response?.data?.error || 'An error occurred.'}` });
			});
	}

	return (
		<SectionContainer>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
				<ProfilePicture profileUser={profileUser}/>
				{
					userID === profileUser.userID ? (
						<IconsContainer>
							<IconButton type="button">
								<i className="bi bi-gear-fill" onClick={() => navigate('/settings')}/>
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
					)
				}
			</MainBarContainer>
		</SectionContainer>
	);
};

export default MainBar;
