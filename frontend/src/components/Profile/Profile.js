import React, { useContext, useEffect } from 'react';
import { ProfileContainer, ProfileBanner, ProfileContentContainer } from '../../styles/Profile/Profile.styled';
import User from './User';
import Loader from '../../styles/shared/Loader.styled';
import ProfileProvider, { ProfileContext } from '../../context/ProfileContext';

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
						<ProfileContentContainer>
							<User/>
						</ProfileContentContainer>
					</>
				)
			}
		</ProfileContainer>
	);
};

export default Profile;
