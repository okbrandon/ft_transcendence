import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import MainStats from './MainStats';
import { IconButton, IconsContainer, MainBarContainer, SectionContainer } from '../styles/main/MainBar.styled';
import { AuthContext } from '../../../context/AuthContext';
import 'react-circular-progressbar/dist/styles.css';
import API from '../../../api/api';

const MainBar = ({ profileUser, matchArray, relation }) => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [disableAddFriend, setDisableAddFriend] = useState(relation.length === 1 ? true : false);

	const handleAddFriend = () => {
		console.log('Add friend');
		API.put('users/@me/relationships', { user: profileUser.userID, type: 0 })
			.then(res => {
				console.log(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	return (
		<SectionContainer>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
				<ProfilePicture profileUser={profileUser}/>
				{
					user.username === profileUser.username ? (
						<IconsContainer>
							<IconButton type="button">
								<i className="bi bi-gear-fill" onClick={() => navigate('/settings')}/>
							</IconButton>
						</IconsContainer>
					) : (
						<IconsContainer>
							<IconButton type="button">
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
