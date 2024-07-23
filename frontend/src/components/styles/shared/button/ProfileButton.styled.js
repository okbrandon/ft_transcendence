import styled from 'styled-components';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from 'react-router-dom';

const StyledProfileButton = styled(DropdownButton)`
	Background-color: #fff;
	background: none;

	& .btn-primary {
		border: none;
		background: none;
		text-align: center;
		width: 150px;
		font-size: 24px;
		font-weight: 700;
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
	}

	& .dropdown-item {
		padding: 0;
		color: #000;
		font-size: 18px;
		font-weight: 550;
		--bs-dropdown-link-hover-bg: #e9e9e9;
		--bs-dropdown-link-active-bg: #d1d1d1;
	}
`;

export const ProfileDropdownLink = styled(Link)`
	display: block;
	color: #000;
	text-decoration: none;
	padding: 8px 18px;
`;

export default StyledProfileButton;
