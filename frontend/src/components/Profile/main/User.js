import React from 'react';
import { UserMainInfoContainer, UserMainInfoLayout } from '../../../styles/Profile/main/UserMainInfo.styled';
import 'react-circular-progressbar/dist/styles.css';
import ProfilePicture from './ProfilePicture';
import UserMainStats from './UserMainStats';

const User = ({ user, matchArray }) => {
	return (
		<UserMainInfoLayout>
			<UserMainInfoContainer>
				<UserMainStats matchArray={matchArray}/>
				<ProfilePicture user={user}/>
			</UserMainInfoContainer>
		</UserMainInfoLayout>
	);
};

export default User;
