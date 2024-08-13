import React, { useContext } from 'react';
import {
	ProfileImageContainer,
	ProfileImage,
	UserContainer,
	LevelContainer,
} from '../../styles/Profile/User.styled';
import { ProfileContext } from '../../context/ProfileContext';
import UserInfo from './UserInfo';
import ProgressBar from 'react-bootstrap/ProgressBar';

const User = () => {
	const { user } = useContext(ProfileContext);

	if (!user) {
		console.log('User: user is null');
		return null;
	}

	return (
		<>
			<UserContainer>
				<ProfileImageContainer>
					<ProfileImage src='./images/prune.jpg' alt='profile picture' roundedCircle/>
					<h2>{user ? user.displayName : ''}</h2>
				</ProfileImageContainer>
				<UserInfo/>
			</UserContainer>
			<LevelContainer>
				<p>Level 1</p>
				<ProgressBar style={{width: '500px'}} variant="success" now={80} label={`${80} / ${100}xp`}/> {/* have to change those values */}
			</LevelContainer>
		</>
	);
};

export default User;
