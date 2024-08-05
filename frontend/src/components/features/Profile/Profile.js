import React from 'react';
import BackButton from '../../styles/shared/button/BackButton.styled';
import ProfileContainer from '../../styles/layouts/profile/ProfileContainer.styled';
import UserProfile from './UserProfile';
import TabsProfile from './TabsProfile';
import CheckToken from '../../../api/token';

const Profile = () => {
	CheckToken();

	return (
		<>
			<BackButton to='/home' hovercolor='#fff'><i className='bi bi-arrow-left' style={{'fontSize': '35px'}}></i></BackButton>
			<ProfileContainer>
				<UserProfile/>
				<TabsProfile/>
			</ProfileContainer>
		</>
	);
};

export default Profile;
