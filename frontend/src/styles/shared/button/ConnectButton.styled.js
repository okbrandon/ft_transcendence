import styled from "styled-components";
import { NavLink } from "react-router-dom";

const ConnectButton = styled(NavLink)`
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
			80deg,
			rgba(150,93,233,1) 10%,
			rgba(99,88,238,1) 95%
		);
		transition: all 0.5s;
		z-index: -1;
	}
`;

export default ConnectButton;
