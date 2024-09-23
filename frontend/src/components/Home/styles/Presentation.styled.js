import styled, { keyframes } from "styled-components";

export const PresentationSection = styled.section`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	gap: 50px;
	height: 100vh;
	width: 100%;
	z-index: 100;

	background:
		linear-gradient(180deg,
			transparent 0%,
			rgba(0,0,0,0.4) 2%,
			rgba(0,0,0,0.7) 5%,
			rgba(0,0,0,1) 15%,
			rgba(0,0,0,1) 60%,
			rgba(0,0,0,0.5) 80%,
			transparent 100%);
	background-size: cover;
	background-position: center;
`;

export const PresentationContent = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	max-width: 900px;
	height: 600px;
	margin-left: 50px;
	padding: 20px;
	line-height: 1.8;
	letter-spacing: 1px;
	text-align: center;
	background: radial-gradient(circle, rgba(164, 69, 178, 0.4) 0%, transparent 50%);

	& > h1 {
		font-size: 60px;
		text-transform: uppercase;
		text-align: center;
		letter-spacing: 8px;
		font-family: 'Orbitron', sans-serif;
		margin-bottom: 50px;

		background: linear-gradient(135deg, #6a0dad, #a445b2);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;

		text-shadow:
			0 0 4px rgba(164, 69, 178, 0.8),
			0 0 8px rgba(128, 0, 128, 0.5);
	}


	& > p {
		font-size: 20px;
		color: #fff;
		font-family: 'Inter', sans-serif;
		text-align: left;
		padding: 0 20px;
		margin-bottom: 40px;
		line-height: 1.6;
		word-spacing: 2px;
		letter-spacing: 2px;
	}
`;

export const PongElementsBackground = styled.div`
	width: 40%;
	height: 600px;
	position: relative;
`;

const floatPaddleAnimation = keyframes`
	0% {
		transform: translateY(0px) rotate(-60deg);
	}
	50% {
		transform: translateY(10px) rotate(-60deg);
	}
	100% {
		transform: translateY(0px) rotate(-60deg);
	}
`;

const slideInLeft = keyframes`
	0% {
		left: -150px;
		rotate: -60deg;
		opacity: 0;
	}
	100% {
		left: -50px;
		rotate: -60deg;
		opacity: 1;
	}
`;

export const PongPaddleBackground = styled.div`
	position: absolute;
	top: 250px;
	left: -150px;
	width: 600px;
	height: 120px;
	background: linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgba(200, 200, 200, 0.4) 100%);
	border-radius: 400px;
	animation: ${floatPaddleAnimation} 4s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
	opacity: 0;
	box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05);

	&.visible {
		animation: ${slideInLeft} 1s forwards;
	}
`;

const floatBallAnimation = keyframes`
	0% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(20px);
	}
	100% {
		transform: translateY(0px);
	}
`;

const slideInRightKeyframe = keyframes`
	0% {
		right: -50px;
		opacity: 0;
	}
	100% {
		right: 150px;
		opacity: 1;
	}
`;

export const PongBallBackground = styled.div`
	position: absolute;
	bottom: 100px;
	right: -50px;
	width: 160px;
	height: 160px;
	background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.7), rgba(200, 200, 200, 0.4));
	border-radius: 50%;
	animation: ${floatBallAnimation} 6s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
	opacity: 0;
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.1);

	&.visible {
		animation: ${slideInRightKeyframe} 1s forwards;
	}
`;
