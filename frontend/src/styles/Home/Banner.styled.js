import styled, { keyframes } from "styled-components";

const glow = keyframes`
	0% {
		text-shadow:
			0 0 5px rgba(255, 255, 255, 0.7),
			0 0 10px rgba(200, 200, 200, 0.6),
			0 0 15px rgba(180, 180, 180, 0.4),
			0 0 20px rgba(150, 150, 150, 0.3);
	}
	100% {
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.8),
			0 0 20px rgba(200, 200, 200, 0.7),
			0 0 30px rgba(180, 180, 180, 0.5),
			0 0 40px rgba(150, 150, 150, 0.4);
	}
`;

export const BannerSection = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	z-index: 100;
	min-height: 100vh;
	background: radial-gradient(circle at center, rgba(48, 48, 48, 0.3), transparent),
			linear-gradient(135deg,
				rgba(20, 20, 20, 0.95) 0%,
				rgba(28, 28, 28, 0.9) 25%,
				rgba(35, 35, 35, 0.9) 50%,
				rgba(28, 28, 28, 0.9) 75%,
				rgba(20, 20, 20, 0.95) 100%);

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('/images/noise-texture.png');
		opacity: 0.03;
		z-index: 50;
	}

	& > h1 {
		font-family: 'Orbitron', serif;
		font-size: 70px;
		text-transform: uppercase;
		text-align: center;
		letter-spacing: 5px;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.8),
			0 0 20px rgba(200, 200, 200, 0.7),
			0 0 30px rgba(180, 180, 180, 0.5),
			0 0 40px rgba(150, 150, 150, 0.4);
		animation: ${glow} 2s infinite alternate;
		z-index: 100;
		margin-bottom: 50px;
		user-select: none;
		background: linear-gradient(135deg, #D9D9D9, #FFFFFF);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
`;

const getRotationAnimation = (scale, direction) => keyframes`
	100% {
		transform: scale(${scale}) rotate(${direction}deg);
		bottom: 110vh;
	}
`;

export const BannerPaddle = styled.div`
	position: absolute;
	width: 70px;
	height: 350px;
	bottom: -35vh;
	left: ${props => props.$left}%;
	filter: blur(${props => props.$blurPx}px);
	transform: scale(${props => props.$scale}) rotate(${props => props.$rotation}deg);
	animation: ${props => getRotationAnimation(props.$scale + 0.5, props.$direction)}
		${props => props.$animationDuration}s linear infinite;
	background: linear-gradient(90deg, rgba(150, 150, 150, 0.7) 10%, rgba(255, 255, 255, 0.7) 95%);
	border-radius: 100px;
`;

export const BannerPaddlesContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 1;
	pointer-events: none;
	overflow: hidden;
`;
