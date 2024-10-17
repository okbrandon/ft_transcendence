import React from 'react';
import MainStats from './MainStats';
import {
	MainBarContainer,
} from '../styles/main/MainBar.styled';

const MainBar = ({ profileUser, matches }) => {
	return (
		<MainBarContainer>
			<MainStats matches={matches}/>
			<p>{profileUser.bio}</p>
		</MainBarContainer>
	);
};

export default MainBar;
