import React, { useContext, useEffect } from 'react';
import { ProfileContainer, ProfileBanner } from '../../styles/Profile/Profile.styled';
import User from './User';
import Loader from '../../styles/shared/Loader.styled';
import ProfileProvider, { ProfileContext } from '../../context/ProfileContext';
import { UserSpacer } from '../../styles/Profile/User.styled';
import Tabs from './Tabs';

export const ProfileParent = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
						<ProfileBanner/>
						<User/>
						<UserSpacer/>
						<Tabs/>
					</>
				)
			}
		</ProfileContainer>
	);
};

export default Profile;
