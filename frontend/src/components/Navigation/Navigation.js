import React, { useState } from 'react';
import { TitleLink } from '../../styles/shared/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	ConnectButton,
} from './styles/Navigation.styled';
import Language from './LanguageDropdown';

const NavBar = () => {
	const [language, setLanguage] = useState("en");

	const setLocalStorageLanguage = lang => {
		if (lang === 'en') {
			return 'en-US';
		} else if (lang === 'es') {
			return 'es-ES';
		} else if (lang === 'fr') {
			return 'fr-FR';
		}
	};

	const handleChangeLoggedOut = (e) => {
		setLanguage(e.target.value);
		localStorage.setItem('i18nextLng', setLocalStorageLanguage(e.target.value));
	};

	return (
		<NavContainer>
			<TitleLink to="/">PONG</TitleLink>
			<NavItemsContainer>
				<ConnectButton to="/login">CONNECT</ConnectButton>
				<Language handleChange={handleChangeLoggedOut} language={language}/>
			</NavItemsContainer>
		</NavContainer>
	);
};

export default NavBar;
