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

	text-shadow:
		0 0 10px rgba(255, 255, 255, 0.7),
		0 0 20px rgba(200, 200, 200, 0.5);

	&::before {
		content: '';
		position: absolute;
		height: 4px;
		width: 50px;
		background: #fff;
		border-radius: 10px;
		bottom: 0;
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.7),
			0 0 20px rgba(200, 200, 200, 0.5);
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
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.7),
			0 0 20px rgba(200, 200, 200, 0.5);
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

	text-shadow:
		0 0 10px rgba(255, 255, 255, 0.7),
		0 0 20px rgba(200, 200, 200, 0.5);

	&::before {
		content: '';
		position: absolute;
		height: 4px;
		width: 50px;
		border-radius: 10px;
		bottom: 0;
		background: #fff;
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.7),
			0 0 20px rgba(200, 200, 200, 0.5);
	}

	&::after {
		content: '';
		position: absolute;
		height: 7px;
		width: 7px;
		border-radius: 50%;
		bottom: 0;
		right: 0;
		background: #fff;
		box-shadow:
			0 0 10px rgba(255, 255, 255, 0.7),
			0 0 20px rgba(200, 200, 200, 0.5);
	}
`;
