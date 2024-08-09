import React, { useContext } from 'react';
import { ProfileContainer } from '../../styles/Profile.styled';
import UserProfile from './UserProfile';
import TabsProfile from './TabsProfile';
import Loader from '../../styles/shared/Loader.styled';
import ProfileProvider, { ProfileContext } from '../../context/ProfileContext';

export const ProfileParent = () => {
	return (
		<ProfileProvider>
			<Profile/>
		</ProfileProvider>
	);
};

const Profile = () => {
	const { loading } = useContext(ProfileContext);

	return (
		<ProfileContainer>
			{
				loading ? <Loader/> : (
					<>
						<UserProfile/>
						<TabsProfile/>
					</>
				)
			}
		</ProfileContainer>
	);
};

export default Profile;
