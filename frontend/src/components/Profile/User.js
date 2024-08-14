import React, { useContext } from 'react';
import {
	ProfileImageContainer,
	ProfileImage,
	LevelContainer,
	ProgressBarContainer,
} from '../../styles/Profile/User.styled';
import { ProfileContext } from '../../context/ProfileContext';
import UserInfo from './UserInfo';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ProfileContentContainer } from '../../styles/Profile/Profile.styled';

const User = () => {
	const { user } = useContext(ProfileContext);

	if (!user) {
		console.log('User: user is null');
		return null;
	}

	return (
		<ProfileContentContainer>
			<ProfileImageContainer>
				<ProfileImage src='./images/prune.jpg' alt='profile picture' roundedCircle/>
				<h2>{user ? user.displayName : ''}</h2>
				<LevelContainer>
					<p>Level 1</p>
					<ProgressBarContainer>
						<p>20xp</p>
						<ProgressBar now={20}/>
						<p>100xp</p>
					</ProgressBarContainer>
				</LevelContainer>
				<UserInfo/>
			</ProfileImageContainer>
		</ProfileContentContainer>
	);
};

export default User;
