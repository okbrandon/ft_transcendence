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
				<i className="bi bi-gear-fill"/>
			</MainBarContainer>
		</MainBarLayout>
	);
};

export default MainBar;
