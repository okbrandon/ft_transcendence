import styled from "styled-components";
import { NavLink } from "react-router-dom";

const StyledNavLink = styled(NavLink)`
	color: #fff;
	font-size: 24px;
	font-weight: 700;
	z-index: 5;
	text-decoration: none;

	&:hover {
		color: #d39eff;
	}
`;

export default StyledNavLink;