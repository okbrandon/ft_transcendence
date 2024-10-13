import React, { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import LanguageDropdown from "./LanguageDropdown";
import SearchBar from "./SearchBar";
import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useRelation } from "../../context/RelationContext";
import { useNotification } from "../../context/NotificationContext";
import {
	FriendsNavLinkContainer,
	NavContainer,
	NavItemsContainer,
	RequestPopUp,
	StyledNavLink,
} from "./styles/Navigation.styled";
import { TitleLink } from "../../styles/shared/Title.styled";
import { useTranslation } from "react-i18next";

const ConnectedNavBar = () => {
	const { addNotification } = useNotification();
	const { user, setUser } = useAuth();
	const { relations } = useRelation();
	const [language, setLanguage] = useState(null);
	const [requestsLen, setRequestsLen] = useState(0);
	const userID = localStorage.getItem('userID');
	const { t, i18n } = useTranslation();

	useEffect(() => {
		setRequestsLen(relations.filter(relation => relation.status === 0 && relation.target.userID === userID).length);
	}, [relations, userID]);

	const handleLanguage = event => {
		setLanguage(event.target.value);
		i18n.changeLanguage(event.target.value);
		API.patch('users/@me/profile', { lang: event.target.value })
			.then(() => {
				setUser(prev => ({
					...prev,
					lang: event.target.value,
				}))
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	useEffect(() => {
		if (!user) return;

		setLanguage(user.lang);
		i18n.changeLanguage(user.lang);
	}, [user, i18n]);

	return (
		<NavContainer>
			<NavItemsContainer $gap='100px'>
				<TitleLink to='/'>{t('header.title')}</TitleLink>
				<NavItemsContainer $gap='100px'>
					<FriendsNavLinkContainer>
						<StyledNavLink to="/friends">{t('header.friendsButton')}</StyledNavLink>
						{!!requestsLen && <RequestPopUp>{requestsLen}</RequestPopUp>}
					</FriendsNavLinkContainer>
					<StyledNavLink to="leaderboard">{t('header.leaderboardButton')}</StyledNavLink>
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
