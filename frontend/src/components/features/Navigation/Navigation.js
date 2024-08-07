import React from 'react';
import NavContainer from '../../styles/layouts/NavContainer.styled';
import { TitleNav } from '../../styles/shared/Title.styled';
import StyledNavLink from '../../styles/shared/button/NavLink.styled';
import ProfileButton from '../../shared/ProfileButton';
import SpaceBetweenContainer from '../../styles/layouts/SpaceBetweenContainer.styled';
import { isLoggedIn } from '../../../api/api';
import ConnectButton from '../../styles/shared/button/ConnectButton.styled';

const NavBar = ({ handleFriends }) => {
	return (
		<NavContainer>
			{
				isLoggedIn() ? (
					<>
						<SpaceBetweenContainer $gap='100px'>
							<TitleNav to="/">PONG</TitleNav>
							<SpaceBetweenContainer $gap='100px'>
								<StyledNavLink onClick={handleFriends}>Friends</StyledNavLink>
								<StyledNavLink to="/">Leaderbord</StyledNavLink>
								<StyledNavLink to="/">Store</StyledNavLink>
							</SpaceBetweenContainer>
						</SpaceBetweenContainer>
						<ProfileButton/>
					</>
				) : (
					<>
						<TitleNav to="/">PONG</TitleNav>
						<ConnectButton to="/login">Connect</ConnectButton>
					</>
				)
			}
		</NavContainer>
	);
};

export default NavBar;
