import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BackButton = styled(Link)`
	position: absolute;
	top: 30px;
	left: 30px;
	background-color: transparent;
	border: none;
	font-size: 16px;
	color: #c8c8c8;
	cursor: pointer;

	&:hover {
		color: #000;
	}
`;

export default BackButton;
