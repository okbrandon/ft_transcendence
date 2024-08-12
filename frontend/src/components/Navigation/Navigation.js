import React, { useContext } from 'react';
import ProfileDropdown from './ProfileDropdown';
import { TitleLink } from '../../styles/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	StyledNavLink,
} from '../../styles/Navigation.styled';
import ConnectButton from '../../styles/shared/button/ConnectButton.styled';
import { AuthContext } from '../../context/AuthContext';
import SearchBar from './SearchBar';

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
								<StyledNavLink to="/">STORE</StyledNavLink>
								<StyledNavLink to="solo-vs-ai">PLAY</StyledNavLink>
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
