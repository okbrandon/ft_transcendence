import React from 'react';
import { MainBarContainer, MainBarLayout } from '../../../styles/Profile/main/MainBar.styled';
import 'react-circular-progressbar/dist/styles.css';
import ProfilePicture from './ProfilePicture';
import MainStats from './MainStats';

const MainBar = ({ user, matchArray }) => {
	return (
		<MainBarLayout>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
				<ProfilePicture user={user}/>
				<p>testing</p>
			</MainBarContainer>
		</MainBarLayout>
	);
};

export default MainBar;
