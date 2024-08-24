import React, { useContext } from 'react';
import ProfileDropdown from './ProfileDropdown';
import SearchBar from './SearchBar';
import { TitleLink } from '../../styles/shared/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	StyledNavLink,
	ConnectButton
} from './styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
	const { isLoggedIn } = useContext(AuthContext);

	return (
		<NavContainer>
			{
				isLoggedIn ? (
					<>
						<NavItemsContainer $gap='100px'>
							<TitleLink to="/">PONG</TitleLink>
							<NavItemsContainer $gap='100px'>
								<StyledNavLink>FRIENDS</StyledNavLink>
								<StyledNavLink to="/">LEADERBOARD</StyledNavLink>
								<StyledNavLink to="shop">SHOP</StyledNavLink>
								<StyledNavLink to="playmenu">PLAY</StyledNavLink>
							</NavItemsContainer>
						</NavItemsContainer>
						<NavItemsContainer $gap='50px'>
							<SearchBar/>
							<ProfileDropdown/>
						</NavItemsContainer>
					</>
				) : (
					<>
						<TitleLink to="/">PONG</TitleLink>
						<ConnectButton to="/login">CONNECT</ConnectButton>
					</>
				)
			}
		</NavContainer>
	);
};

export default NavBar;
