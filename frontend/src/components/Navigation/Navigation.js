import React, { useContext } from 'react';
import ProfileButton from './ProfileButton';
import { TitleLink } from '../../styles/Title.styled';
import {
	NavContainer,
	NavItemsContainer,
	StyledNavLink,
	ConnectButton
} from '../../styles/Navigation.styled';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
	const { isLoggedIn } = useContext(AuthContext);

	// While in the login page, it keeps refreshing the following component
	return (
		<NavContainer>
			{
				isLoggedIn ? (
					<>
						<NavItemsContainer $gap='100px'>
							<TitleLink to="/">PONG</TitleLink>
							<NavItemsContainer $gap='100px'>
								<StyledNavLink>Friends</StyledNavLink>
								<StyledNavLink to="/">Leaderboard</StyledNavLink>
								<StyledNavLink to="/">Store</StyledNavLink>
							</NavItemsContainer>
						</NavItemsContainer>
						<ProfileButton/>
					</>
				) : (
					<>
						<TitleLink to="/">PONG</TitleLink>
						<ConnectButton to="/login">Connect</ConnectButton>
					</>
				)
			}
		</NavContainer>
	);
};

export default NavBar;
