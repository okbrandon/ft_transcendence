import styled, { keyframes } from 'styled-components';

const floatBarAnimation = keyframes`
	0% {
		transform: translateY(0vh) rotate(-40deg);
	}
	50% {
		transform: translateY(2vh) rotate(-40deg);
	}
	100% {
		transform: translateY(0vh) rotate(-40deg);
	}
`;

const floatBallAnimation = keyframes`
	0% {
		transform: translateY(0vh);
	}
	50% {
		transform: translateY(3vh);
	}
	100% {
		transform: translateY(0vh);
	}
`;

export const PongBar = styled.div`
	position: absolute;
	top: 21vh;
	left: 10vw;
	width: 800px;
	height: 150px;
	background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%);
	border-radius: 400px;
	transform: rotate(-40deg);
	animation: ${floatBarAnimation} 2s ease-in-out infinite forwards;
	opacity: 0.7;
	z-index: 3;
`;
	
	export const PongBall = styled.div`
	position: absolute;
	top: 55vh;
	right: 22vw;
	width: 250px;
	height: 250px;
	background: linear-gradient(133deg, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%);
	border-radius: 50%;
	animation: ${floatBallAnimation} 3s ease-in-out infinite forwards;
	opacity: 0.7;
	z-index: 3;
`;
