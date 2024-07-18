import styled, { keyframes } from "styled-components";

const drop = keyframes`
	0% {
		top: -50%;
	}
	100% {
		top: 110%;
	}
`;

const ballDrop = keyframes`
	0% {
		top: -35%;
	}
	100% {
		top: 125%;
	}
`;

export const Lines = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 100%;
	margin: auto;
	width: 90vw;
`;

export const Line = styled.div`
	position: absolute;
	width: 5px;
	height: 100%;
	top: 0;
	left: 50%;
	background: #000;
	overflow: hidden;

	&::before {
		content: '';
		display: block;
		position: absolute;
		height: 5px;
		width: 5px;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 50%;
		background: #fff;
		animation: ${ballDrop} 7s 0s infinite forwards;
		animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
	}

	&::after {
		content: '';
		display: block;
		position: absolute;
		height: 15vh;
		width: 1px;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #fff 75%, #fff 100%);
		animation: ${drop} 7s 0s infinite forwards;
		animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
	}

	&:nth-child(1) {
		margin-left: -25%;
		&::after {
			animation-delay: 2s;
		}
		&::before {
			animation-delay: 2s;
		}
	}

	&:nth-child(3) {
		margin-left: 25%;
		&::after {
			animation-delay: 3.5s;
		}
		&::before {
			animation-delay: 3.5s;
		}
	}
`;
