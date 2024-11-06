import styled, { keyframes } from "styled-components";
import Button from "react-bootstrap/Button";

export const HeroSection = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	z-index: 100;
	height: 100vh;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	background:
		radial-gradient(circle at 10% 20%, rgba(128, 0, 128, 0.15), transparent 40%),
		radial-gradient(circle at 80% 80%, rgba(75, 0, 130, 0.2) 0%, transparent 30%),
		radial-gradient(circle at 50% 50%, rgba(50, 0, 70, 0.1), transparent 50%),
		radial-gradient(circle at 100% 50%, rgba(30, 0, 40, 0.3), transparent 50%);

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('/images/noise-texture.webp');
		opacity: 0.03;
		z-index: 50;
	}

	& > h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 80px;
		text-transform: uppercase;
		text-align: center;
		letter-spacing: 10px;
		color: #ffffff;
		margin-bottom: 30px;
		z-index: 100;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.6),
			0 0 15px rgba(128, 0, 128, 0.4),
			0 0 20px rgba(75, 0, 130, 0.3);
		user-select: none;
	}
`;

const getRotationAnimation = (scale, direction) => keyframes`
	100% {
		transform: scale(${scale}) rotate(${direction}deg);
		bottom: 130vh;
	}
`;

export const HeroPaddle = styled.div`
	position: absolute;
	width: 70px;
	height: 350px;
	bottom: -35vh;
	left: ${props => props.$left}%;
	filter: blur(${props => props.$blurPx}px) opacity(0.7);
	transform: scale(${props => props.$scale}) rotate(${props => props.$rotation}deg);
	animation: ${props => getRotationAnimation(props.$scale + 0.5, props.$direction)}
		${props => props.$animationDuration}s linear infinite;
	background: linear-gradient(90deg, rgba(120, 120, 120, 0.6) 10%, rgba(200, 200, 200, 0.6) 95%);
	border-radius: 100px;
`;

export const HeroPaddlesContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 120vh;
	top: 0;
	left: 0;
	z-index: 1;
	pointer-events: none;
	overflow: hidden;
`;

export const PlayButton = styled(Button)`
	background: linear-gradient(135deg, #111111, #2c003e);
	color: #fff;
	font-family: 'Orbitron', sans-serif;
	font-size: 30px;
	padding: 15px 40px;
	border: 2px solid rgba(128, 0, 128, 0.5);
	border-radius: 50px;
	cursor: pointer;
	text-transform: uppercase;
	box-shadow: 0 4px 15px rgba(128, 0, 128, 0.5), 0 0 20px rgba(128, 0, 128, 0.7);
	transition: all 0.2s ease-in-out;
	outline: none;
	z-index: 500;

	backdrop-filter: blur(5px);
	background-blend-mode: overlay;

	&:hover {
		color: #ffffff;
		background: linear-gradient(135deg, #2c003e, #4b0082);
		box-shadow: 0 6px 25px rgba(128, 0, 128, 0.7), 0 0 30px rgba(128, 0, 128, 0.9);
		transform: scale(1.1);
	}

	&:active {
		background: linear-gradient(135deg, #1A1A1A, #2c003e);
		box-shadow: 0 2px 10px rgba(128, 0, 128, 0.3);
		transform: scale(0.98);
	}

	text-shadow: 0 0 5px rgba(128, 0, 128, 0.8), 0 0 10px rgba(128, 0, 128, 0.6);
`;
