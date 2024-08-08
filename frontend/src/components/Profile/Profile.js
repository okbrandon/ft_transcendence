import React, { useState } from 'react';
import NavBar from '../Navigation/Navigation';
import { ProfileContainer } from '../../styles/Profile.styled';
import UserProfile from './UserProfile';
import TabsProfile from './TabsProfile';
import Loader from '../../styles/shared/Loader.styled';
import Footer from '../Footer/Footer';

const Profile = () => {
	const [userLoaded, setUserLoaded] = useState(false);
	const [tabsLoaded, setTabsLoaded] = useState(false);

	return (
		<>
			<NavBar/>
			<ProfileContainer>
				<UserProfile setUserLoaded={setUserLoaded}/>
				<TabsProfile setTabsLoaded={setTabsLoaded}/>
				{(!userLoaded || !tabsLoaded) && <Loader/>}
			</ProfileContainer>
			<Footer/>
		</>
	);
};

export default Profile;
