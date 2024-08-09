import DropdownButton from "react-bootstrap/esm/DropdownButton";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

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

export const ProfileButtonContainer = styled(DropdownButton)`
	Background-color: #fff;
	background: none;

	& .btn-primary {
		border: none;
		background: none;
		text-align: center;
		width: 150px;
		font-size: 20px;
		font-weight: 500;
		z-index: 500;
		text-decoration: none;
		margin: 0 2vw;

		&:hover {
			color: #d39eff;
		}

		&:active {
			border: none;
			background: none;
		}
	}

	& .dropdown-menu {
		background-color: #fff;
		--bs-dropdown-link-active-bg: #ececec;
		font-size: 18px;
		font-weight: 550;
	}

	& .dropdown-item {
		font-size: 18px;
		font-weight: 550;
		--bs-dropdown-link-hover-bg: #e9e9e9;
		--bs-dropdown-link-active-bg: #d1d1d1;
		--bs-dropdown-link-active-color: #000;
	}
`;

export const StyledNavLink = styled(NavLink)`
	color: #fff;
	text-align: center;
	font-size: 20px;
	font-weight: 500;
	z-index: 1000;
	text-decoration: none;

	&:hover {
		color: #d39eff;
	}
`;

export const ConnectButton = styled(NavLink)`
	position: relative;
	overflow: hidden;
	height: 50px;
	padding: 10px 30px;
	border-radius: 1.5rem;
	background: #3d3a4e;
	background-size: 400%;
	color: #fff;
	border: none;
	cursor: pointer;

	text-align: center;
	font-size: 20px;
	font-weight: 700;
	z-index: 1000;
	text-decoration: none;

	&:hover::before {
		transform: scaleX(1);
	}
	
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		transform: scaleX(0);
		transform-origin: 0 50%;
		width: 100%;
		height: inherit;
		border-radius: inherit;
		background: linear-gradient(
			82.3deg,
			rgba(150,93,233,1) 11%,
			rgba(99,88,238,1) 95%
		);
		transition: all 0.5s;
		z-index: -1;
	}
`;
