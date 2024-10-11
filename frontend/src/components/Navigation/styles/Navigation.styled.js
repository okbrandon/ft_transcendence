import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

export const NavContainer = styled.nav`
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(10px);
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

export const FriendsNavLinkContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`;

export const RequestPopUp = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	background: #ff0000;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	font-size: 0.8rem;
	font-weight: 700;
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
	width: 250px;

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
		background: linear-gradient(80deg, rgba(75, 0, 130, 0.8) 10%, rgba(59, 130, 246, 0.8) 95%);
		transition: all 0.5s;
		z-index: -1;
	}
`;

const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

export const ProfileDropdownButton = styled(Dropdown)`
	margin-left: 30px;

	& .btn-primary {
		color: #fff;
		background: none;
		border: none;
		font-size: 16px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 12px;
		transition: color 0.3s ease, text-shadow 0.3s ease;

		&:hover {
			color: #ffffff;
			text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6);
		}

		&:focus {
			outline: none;
			box-shadow: none;
		}

		&:active {
			border: none;
			background: none;
		}
	}

	& .dropdown-menu {
		background: rgba(20, 20, 20, 0.95);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		font-size: 15px;
		font-weight: 500;
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		animation: ${fadeIn} 0.3s ease;
		width: auto;
		min-width: 160px;

		& .dropdown-divider {
			border-top: 1px solid rgba(255, 255, 255, 0.2);
			margin: 8px 0;
		}

		& .dropdown-item {
			color: #fff;
			font-size: 15px;
			font-weight: 500;
			padding: 10px 20px;
			border-radius: 5px;
			transition: background-color 0.3s ease, transform 0.2s ease;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
				color: #ffffff;
			}

			&:active {
				background-color: rgba(255, 255, 255, 0.2);
			}
		}
	}
`;
