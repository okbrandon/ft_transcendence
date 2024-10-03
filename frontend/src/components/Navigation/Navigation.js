import React, { useState } from 'react';
import { TitleLink } from '../../styles/shared/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	ConnectButton,
} from './styles/Navigation.styled';
import Language from './LanguageDropdown';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
	const [language, setLanguage] = useState("en");
	const { t, i18n } = useTranslation();

	const getCorrectLanguageCode = lang => {
		if (lang === 'en') {
			return 'EN';
		} else if (lang === 'es') {
			return 'ES';
		} else if (lang === 'fr') {
			return 'FR';
		}
	};

	const handleChangeLoggedOut = (e) => {
		setLanguage(e.target.value);
		i18n.changeLanguage(getCorrectLanguageCode(e.target.value));
	};

	return (
		<NavContainer>
			<TitleLink to="/">{t('header.title')}</TitleLink>
			<NavItemsContainer>
				<ConnectButton to="/signin">{t('header.connectButton')}</ConnectButton>
				<Language handleChange={handleChangeLoggedOut} language={language}/>
			</NavItemsContainer>
		</NavContainer>
	);
};

export default NavBar;
