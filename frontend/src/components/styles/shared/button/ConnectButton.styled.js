import { NavLink } from "react-router-dom";
import styled from "styled-components";

const ConnectButton = styled(NavLink)`
	color: #fff;
	text-align: center;
	font-size: 24px;
	font-weight: 700;
	z-index: 1000;
	text-decoration: none;
	padding: 10px;
	background-color: #656565;
	border-radius: 5px;

	&:hover {
		background-color: #424242;
	}
`;

export default ConnectButton;
