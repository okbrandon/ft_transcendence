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
						<ProfileButton/>
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
