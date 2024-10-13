import React from 'react';
import MainStats from './MainStats';
import {
	MainBarContainer,
} from '../styles/main/MainBar.styled';

const MainBar = ({ profileUser, matchArray }) => {
	return (
		<MainBarContainer>
			<MainStats matchArray={matchArray}/>
			<p>{profileUser.bio}</p>
		</MainBarContainer>
	);
};

export default MainBar;
