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

export default ProfileDropdownButton;
