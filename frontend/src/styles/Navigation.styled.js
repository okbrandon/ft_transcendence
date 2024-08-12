import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";

export const NavContainer = styled.nav`
	display: flex;
	background-repeat: no-repeat;
	background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%);
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
	color: rgba(255,255,255,0.8);
	text-align: center;
	font-size: 16px;
	font-weight: 500;
	z-index: 1000;
	text-decoration: none;

	&:hover::after {
		width: 100%;
		background-color: rgba(255,255,255,1);
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
		color: rgba(255,255,255,1);
	}
`;

export const SearchBarContainer = styled(Form)`
	display: flex;
	position: relative;
	align-items: center;
	width: 210px;
	border: 1px solid rgba(255,255,255,0.5);

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
	border: 1px solid rgba(255,255,255,0.5);
	bottom: -50px;
	width: 100%;
	background-color: rgba(0,0,0,0.9);
	z-index: 1000;
`;
