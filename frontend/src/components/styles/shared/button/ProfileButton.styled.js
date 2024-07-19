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
	}

	& .dropdown-item {
		color: #000;
		font-size: 18px;
		font-weight: 550;
	}
`;

export const ProfileDropdownLink = styled(Link)`
	color: #000;
	text-decoration: none;
`;

export default StyledProfileButton;
