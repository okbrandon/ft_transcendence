import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavContainer = styled.nav`
	display: flex;
	background-repeat: no-repeat;
	background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%);
	justify-content: space-between;
	align-items: center;
	position: fixed;
	padding-left: 6rem;
	padding-right: 6rem;
	top: 0;
	left: 0;
	width: 100vw;
	height: 150px;
	z-index: 10000;
`;

export const NavItemsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	${({ $gap }) => $gap && `gap: ${$gap}`};
`;

export const StyledNavLink = styled(NavLink)`
	color: #fff;
	text-align: center;
	font-size: 20px;
	font-weight: 500;
	z-index: 1000;
	text-decoration: none;

	&:hover {
		color: rgba(150,93,233,1);
	}
`;
