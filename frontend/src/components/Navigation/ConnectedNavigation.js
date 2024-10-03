import React, { useContext, useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import LanguageDropdown from "./LanguageDropdown";
import SearchBar from "./SearchBar";
import {
	FriendsNavLinkContainer,
	NavContainer,
	NavItemsContainer,
	RequestPopUp,
	StyledNavLink,
} from "./styles/Navigation.styled";
import { TitleLink } from "../../styles/shared/Title.styled";
import API from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { RelationContext } from "../../context/RelationContext";
import { useTranslation } from "react-i18next";

const ConnectedNavBar = () => {
	const { setUser } = useContext(AuthContext);
	const { requests } = useContext(RelationContext);
	const [language, setLanguage] = useState("en");
	const [requestsLen, setRequestsLen] = useState(0);
	const { t, i18n } = useTranslation();

	useEffect(() => {
		setRequestsLen(requests.length);
	}, [requests]);

	const getCorrectLanguageCode = lang => {
		if (lang === 'en') {
			return 'EN';
		} else if (lang === 'es') {
			return 'ES';
		} else if (lang === 'fr') {
			return 'FR';
		}
	};

	const handleLanguage = event => {
		setLanguage(event.target.value);
		i18n.changeLanguage(getCorrectLanguageCode(event.target.value));
		API.patch('users/@me/profile', { lang: event.target.value })
			.then(() => {
				setUser(prev => ({
					...prev,
					lang: event.target.value,
				}))
			})
			.catch(err => {
				console.error(err.response?.data?.error || 'An error occurred');
			});
	};

	return (
		<NavContainer>
			<NavItemsContainer $gap='100px'>
				<TitleLink to='/'>{t('header.title')}</TitleLink>
				<NavItemsContainer $gap='100px'>
					<FriendsNavLinkContainer>
						<StyledNavLink to="/friends">{t('header.friendsButton')}</StyledNavLink>
						{!!requestsLen && <RequestPopUp>{requestsLen}</RequestPopUp>}
					</FriendsNavLinkContainer>
					<StyledNavLink to="/">{t('header.leaderboardButton')}</StyledNavLink>
					<StyledNavLink to="shop">{t('header.storeButton')}</StyledNavLink>
					<StyledNavLink to="playmenu">{t('header.playButton')}</StyledNavLink>
				</NavItemsContainer>
			</NavItemsContainer>
			<NavItemsContainer>
				<SearchBar/>
				<ProfileDropdown/>
				<LanguageDropdown handleChange={handleLanguage} language={language}/>
			</NavItemsContainer>
		</NavContainer>
	);
};

export default ConnectedNavBar;
