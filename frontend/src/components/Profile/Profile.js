import React from 'react';
import NavBar from '../Navigation/Navigation';
import { ProfileContainer } from '../../styles/Profile.styled';
import UserProfile from './UserProfile';
import TabsProfile from './TabsProfile';

const Profile = () => {
	return (
		<>
			<NavBar/>
			<ProfileContainer>
				<UserProfile/>
				<TabsProfile/>
			</ProfileContainer>
		</>
	);
};

export default Profile;
