import React from 'react';
import MainStats from './MainStats';
import {
	MainBarContainer,
} from '../styles/main/MainBar.styled';
import { useTranslation } from 'react-i18next';

const MainBar = ({ profileUser, matchArray }) => {
	const { t } = useTranslation();

	return (
		<MainBarContainer>
			<MainStats matchArray={matchArray}/>
			<p>{profileUser.bio ? profileUser.bio : t('profile.about.bio.notSet')}</p>
		</MainBarContainer>
	);
};

export default MainBar;
