import React from 'react';
import NavContainer from '../../styles/layouts/NavContainer.styled';
import { TitleNav } from '../../styles/shared/Title.styled';
import StyledNavLink from '../../styles/shared/button/NavLink.styled';
import ProfileButton from '../../shared/ProfileButton';

const NavBar = ({ handleFriends }) => {
	return (
		<NavContainer>
			<StyledNavLink onClick={handleFriends}>Friends</StyledNavLink>
			<StyledNavLink to="/home">Leaderbord</StyledNavLink>
			<TitleNav to="/home">PONG</TitleNav>
			<StyledNavLink to="/home">Store</StyledNavLink>
			<ProfileButton/>
		</NavContainer>
	);
};

export default NavBar;
