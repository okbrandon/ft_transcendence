import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Title = styled.h1`
	font-size: 200px;
	text-align: center;
	margin-bottom: 100px;
	position: relative;
	user-select: none;
	z-index: 5;

	&::before {
		content: '';
		position: absolute;
		height: 20px;
		width: 200px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 35px;
		width: 35px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;

export const TitleNav = styled(Link)`
	position: relative;
	font-size: 100px;
	text-align: center;
	margin: 0 10vw;
	padding: 0;
	color: #fff;
	text-decoration: none;
	z-index: 5;

	&::before {
		content: '';
		position: absolute;
		height: 10px;
		width: 100px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 16px;
		width: 16px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;

export default Title;