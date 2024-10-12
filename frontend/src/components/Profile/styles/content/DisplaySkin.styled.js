import styled, { keyframes } from "styled-components";

const movePaddle = keyframes`
	0% {
		transform: translateX(100%);
	}
	50% {
		transform: translateX(110%);
	}
	100% {
		transform: translateX(100%);
	}
`;

export const DisplaySkinPaddle = styled.div`
	background: ${({ $skin }) => $skin ? `url(${$skin})` : '#fff'};
	width: 225px;
	height: 40px;
	border-radius: 20px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
	animation: ${movePaddle} 2s infinite;
`;
