import React, { useContext, useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import SearchBar from './SearchBar';
import { TitleLink } from '../../styles/shared/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	StyledNavLink,
	ConnectButton,
	FriendsNavLinkContainer,
	RequestPopUp
} from './styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';
import Language from './LanguageDropdown';
import API from '../../api/api';

const NavBar = () => {
	const { isLoggedIn, setUser } = useContext(AuthContext);
	const [language, setLanguage] = useState("en");
	const [requests, setRequests] = useState([]);

	// useEffect(() => {
	// 	if (isLoggedIn) {
	// 		GetRequests()
	// 			.then(users => {
	// 				setRequests(users);
	// 			})
	// 			.catch(err => {
	// 				console.error(err.response?.data?.error || 'An error occurred');
	// 			});
	// 	}
	// 	setIsRefresh(false);
	// }, [isRefresh, setIsRefresh, isLoggedIn]);

	const handleChangeLoggedIn = (e) => {
		setLanguage(e.target.value);
		API.patch('/users/@me/profile', { lang: e.target.value })
			.then(() => {
				setUser(prev => ({
					...prev,
					lang: e.target.value,
				}));
			})
			.catch(err => {
				console.error(err.response?.data?.error || 'An error occurred');
			});
	};

	const setLocalStorageLanguage = lang => {
		if (lang === 'en') {
			return 'en-US';
		} else if (lang === 'es') {
			return 'es-ES';
		} else if (lang === 'fr') {
			return 'fr-FR';
		}
	}

	const handleChangeLoggedOut = (e) => {
		setLanguage(e.target.value);
		localStorage.setItem('i18nextLng', setLocalStorageLanguage(e.target.value));
	};

	return (
		<NavContainer>
			{
				isLoggedIn ? (
					<>
						<NavItemsContainer $gap='100px'>
							<TitleLink to="/">PONG</TitleLink>
							<NavItemsContainer $gap='100px'>
								<FriendsNavLinkContainer>
									<StyledNavLink to="friends">FRIENDS</StyledNavLink>
									{requests.length && <RequestPopUp>{requests.length}</RequestPopUp>}
								</FriendsNavLinkContainer>
								<StyledNavLink to="/">LEADERBOARD</StyledNavLink>
								<StyledNavLink to="shop">SHOP</StyledNavLink>
								<StyledNavLink to="playmenu">PLAY</StyledNavLink>
							</NavItemsContainer>
						</NavItemsContainer>
						<NavItemsContainer>
							<SearchBar/>
							<ProfileDropdown/>
							<Language handleChange={handleChangeLoggedIn} language={language}/>
						</NavItemsContainer>
					</>
				) : (
					<>
						<TitleLink to="/">PONG</TitleLink>
						<NavItemsContainer>
							<ConnectButton to="/login">CONNECT</ConnectButton>
							<Language handleChange={handleChangeLoggedOut} language={language}/>
						</NavItemsContainer>
					</>
				)
			}
		</NavContainer>
	);
};

export default NavBar;
