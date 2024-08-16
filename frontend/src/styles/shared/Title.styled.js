import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Title = styled.h1`
	position: relative;
	font-family: 'Inter', sans-serif;
	height: 48px;
	font-size: 40px;
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
		height: 4px;
		width: 50px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 7px;
		width: 7px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;

export const TitleLink = styled(Link)`
	position: relative;
	font-family: 'Inter', sans-serif;
	height: 55px;
	font-size: 40px;
	font-weight: 400;
	text-align: center;
	margin: 0;
	padding: 0;
	color: #fff;
	text-decoration: none;
	margin-bottom: 14px;
	z-index: 1000;

	&::before {
		content: '';
		position: absolute;
		height: 4px;
		width: 50px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
	}

	&::after {
		content: '';
		position: absolute;
		height: 7px;
		width: 7px;
		background: #fff;
		border-radius: 50%;
		bottom: 0;
		right: 0;
	}
`;
