import React, { useContext } from 'react';
import {
	ProfileImageContainer,
	ProfileImage,
} from '../../styles/Profile/User.styled';
import { ProfileContext } from '../../context/ProfileContext';
import UserInfo from './UserInfo';
import { ProfileContentContainer } from '../../styles/Profile/Profile.styled';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const User = () => {
	const { user } = useContext(ProfileContext);

	if (!user) {
		console.log('User: user is null');
		return null;
	}

	return (
		<ProfileContentContainer>
			<ProfileImageContainer>
				<div style={{width: '190px', height: '190px', position: 'relative'}}>
					<ProfileImage src='./images/prune.jpg' alt='profile picture' roundedCircle />
					<div style={{position: 'absolute'}}>
						<CircularProgressbar
							value={20}
							strokeWidth={4}
							styles={buildStyles({
								rotation: 0.5,
								pathColor: `#64ff61`,
								trailColor: 'rgba(255,255,255,0.4)',
							})}
						/>
					</div>
				</div>
				<h2>{user ? user.displayName : ''}</h2>
				<UserInfo />
			</ProfileImageContainer>
		</ProfileContentContainer>
	);
};

export default User;
