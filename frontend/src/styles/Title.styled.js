import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Title = styled.h1`
	position: relative;
	font-family: 'Inter', sans-serif;
	height: 62px;
	font-size: 50px;
	font-weight: 400;
	text-align: center;
	margin: 0;
	padding: 0;
	color: #fff;
	text-decoration: none;
	z-index: 1000;

	&::before {
		content: '';
		position: absolute;
		height: 5px;
		width: 100px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 8px;
		width: 8px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;

export const TitleLink = styled(Link)`
	position: relative;
	font-family: 'Inter', sans-serif;
	height: 85px;
	font-size: 60px;
	font-weight: 400;
	text-align: center;
	margin: 0;
	padding: 0;
	color: #fff;
	text-decoration: none;
	z-index: 1000;

	&::before {
		content: '';
		position: absolute;
		height: 5px;
		width: 100px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 8px;
		width: 8px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;
