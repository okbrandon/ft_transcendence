import styled, { keyframes } from 'styled-components';

const floatBar = keyframes`
	0% {
		transform: translate(-30vw, -20%) rotate(-40deg);
	}

	50% {
		transform: translate(-30vw, -30%) rotate(-40deg);
	}

	100% {
		transform: translate(-30vw, -20%) rotate(-40deg);
	}
`

const floatBall = keyframes`
	0% {
		transform: translate(10vw, 150%);
	}

	50% {
		transform: translate(10vw, 140%);
	}

	100% {
		transform: translate(10vw, 150%);
	}
`

export const PongBar = styled.div`
	position: absolute;
	width: 800px;
	height: 150px;
	background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%);
	border-radius: 400px;
	transform: translate(-30vw, -20%) rotate(-40deg);
	animation: ${floatBar} 2s ease-in-out infinite;
	opacity: 0.7;
`

export const PongBall = styled.div`
	position: absolute;
	width: 250px;
	height: 250px;
	left: 60%;
	background: linear-gradient(133deg, rgba(255,255,255,1) 0%, rgba(50,50,50,1) 100%);
	border-radius: 50%;
	transform: translate(10vw, 150%);
	animation: ${floatBall} 3s ease-in-out infinite;
	opacity: 0.7;
`
