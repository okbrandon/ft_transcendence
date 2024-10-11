import React from 'react';
import MainStats from './MainStats';
import {
	MainBarContainer,
	SectionContainer
} from '../styles/main/MainBar.styled';
import 'react-circular-progressbar/dist/styles.css';

const MainBar = ({ matchArray }) => {
	return (
		<SectionContainer>
			<MainBarContainer>
				<MainStats matchArray={matchArray}/>
			</MainBarContainer>
		</SectionContainer>
	);
};

export default MainBar;
