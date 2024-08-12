import styled, { keyframes } from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`;

const ProfileDropdownButton = styled(Dropdown)`
	& .btn-primary {
		color: rgba(255,255,255,0.8);
		border: none;
		background: none;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		z-index: 500;
		text-decoration: none;

		&:hover {
			color: rgba(255,255,255,1);
		}
			
		&:active {
			border: none;
			background: none;
		}
	}

	& .dropdown-menu {
		background: linear-gradient(
			80deg,
			rgba(150,93,233,1) 10%,
			rgba(99,88,238,1) 95%
		);
		--bs-dropdown-link-active-bg: #ececec;
		font-size: 16px;
		font-weight: 550;
		animation: ${fadeIn} 0.5s ease;
	}

	& .dropdown-item {
		font-size: 16px;
		font-weight: 550;
		color: #fff;
		--bs-dropdown-link-hover-bg: rgba(255,255,255,0.3);
		--bs-dropdown-link-active-bg: #d1d1d1;
	}
`;

export default ProfileDropdownButton;
