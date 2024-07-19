import styled from "styled-components";
import { NavLink } from "react-router-dom";

const StyledNavLink = styled(NavLink)`
	color: #fff;
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
`;

export default StyledNavLink;