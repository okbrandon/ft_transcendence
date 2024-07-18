import React from 'react';
import NavContainer from '../../styles/layouts/NavContainer.styled';
import { TitleNav } from '../../styles/shared/Title.styled';
import StyledNavLink from '../../styles/shared/NavLink.styled';

const NavBar = () => {
	return (
		<NavContainer>
			{/* Nav items go here */}
			<StyledNavLink to="/mainmenu">Friends</StyledNavLink>
			<StyledNavLink to="/mainmenu">Leaderbord</StyledNavLink>
			<TitleNav to="/mainmenu">PONG</TitleNav>
			<StyledNavLink to="/mainmenu">Store</StyledNavLink>
			<StyledNavLink to="/mainmenu">Profile</StyledNavLink>
		</NavContainer>
	);
};

export default NavBar;
