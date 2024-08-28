import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

export const NavContainer = styled.nav`
	background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding: 15px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	padding-left: 2rem;
	padding-right: 6rem;
	top: 0;
	left: 0;
	width: 100vw;
	height: 80px;
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
	font-size: 16px;
	font-weight: 500;
	padding: 10px 20px;
	text-decoration: none;
	transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
	z-index: 1000;

	&:hover::after {
		width: 100%;
		background: #fff;
	}

	&::after {
		content: '';
		text-align: center;
		display: block;
		height: 2px;
		width: 0;
		background: transparent;
		transition: width 0.5s ease, background-color 0.5s ease;
	}

	&:hover {
		color: #fff;
		text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.6);
	}
`;

export const SearchBarContainer = styled(Form)`
	display: flex;
	position: relative;
	align-items: center;
	width: 210px;

	& i {
		margin-right: 10px;
		font-size: 19px;
		cursor: pointer;
	}

	& .form-control {
		color: white;
		border: none;
		border-radius: 0;
		background-color: transparent;
		border-bottom: 1px solid rgba(255,255,255,0.5);

		&::placeholder {
			color: rgba(255,255,255,0.3);
		}

		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
`;

export const ProfileListContainer = styled.div`
	position: absolute;
	bottom: -50px;
	width: 100%;
	background-color: rgba(0,0,0,0.9);
	z-index: 1000;
`;

export const ConnectButton = styled(NavLink)`
	position: relative;
	overflow: hidden;
	height: 50px;
	padding: 10px 30px;
	border-radius: 1.5rem;
	background: #1c1c1c;
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
		background: linear-gradient(80deg, rgba(230, 230, 230, 0.8) 10%, rgba(200, 200, 200, 0.8) 95%);
		transition: all 0.5s;
		z-index: -1;
	}
`;

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`;

export const ProfileDropdownButton = styled(Dropdown)`
	& .btn-primary {
		color: #fff;
		border: none;
		background: none;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		z-index: 500;
		text-decoration: none;
		transition: text-shadow 0.3s ease;

		&:hover {
			color: #fff;
			text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.6);
		}

		&:active {
			border: none;
			background: none;
		}
	}

	& .dropdown-menu {
		background: #121212;
		border: 1px solid rgba(255, 255, 255, 0.2);
		--bs-dropdown-link-active-bg: rgba(200, 200, 200, 0.1);
		font-size: 16px;
		font-weight: 550;
		animation: ${fadeIn} 0.4s ease;
		padding: 10px;
		border-radius: 10px;
		box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
	}

	& .dropdown-divider {
		border-top: 1px solid rgba(255,255,255,0.3);
	}

	& .dropdown-item {
		font-size: 16px;
		font-weight: 550;
		color: #fff;
		--bs-dropdown-link-hover-bg: rgba(255, 255, 255, 0.1);
		--bs-dropdown-link-active-bg: rgba(255, 255, 255, 0.2);
		padding: 8px 15px;
		border-radius: 5px;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
			color: #ffffff;
		}
	}
`;
