import styled, { keyframes } from "styled-components";

export const DisplaySkinContainer = styled.div`
	grid-column: 1;
	grid-row: 4 / 6;
	margin-top: 30px;
	background: rgba(5,5,5,0.8);
	border-radius: 20px;
	height: 300px;
	border: 1px solid rgba(255,255,255,0.1);
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.3);
	position: relative;
	width: 100%;
`;

const movePaddle = keyframes`
	0% {
		transform: translateX(-30%);
	}
	50% {
		transform: translateX(-70%);
	}
	100% {
		transform: translateX(-30%);
	}
`;

export const DisplaySkinPaddle = styled.div`
	position: absolute;
	bottom: 100px;
	left: 50%;
	transform: translateX(-50%);
	background: ${({ $skin }) => $skin ? `url(${$skin})` : '#fff'};
	width: 225px;
	height: 40px;
	border-radius: 20px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
	animation: ${movePaddle} 2s infinite;
`;
