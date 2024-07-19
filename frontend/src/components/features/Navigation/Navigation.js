import React from 'react';
import NavContainer from '../../styles/layouts/NavContainer.styled';
import { TitleNav } from '../../styles/shared/Title.styled';
import StyledNavLink from '../../styles/shared/NavLink.styled';

const NavBar = ({ handleFriends }) => {
	return (
		<NavContainer>
			<StyledNavLink onClick={handleFriends}>Friends</StyledNavLink>
			<StyledNavLink to="/mainmenu">Leaderbord</StyledNavLink>
			<TitleNav to="/mainmenu">PONG</TitleNav>
			<StyledNavLink to="/mainmenu">Store</StyledNavLink>
			<StyledNavLink to="/mainmenu">Profile</StyledNavLink>
		</NavContainer>
	);
};

export default NavBar;
