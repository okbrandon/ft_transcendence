import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

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

export const FeaturesContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 50px;
	width: 100%;
	max-width: 900px;
`;

export const FeatureItem = styled.div`
	background-color: rgba(10, 10, 10, 0.6);
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 15px rgba(164, 69, 178, 0.5), 0 0 15px rgba(59, 130, 246, 0.5);
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	border: 1px solid rgba(164, 69, 178, 0.3);

	&:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(212, 24, 114, 0.6), 0 0 20px rgba(59, 130, 246, 0.6);
		border: 1px solid rgba(164, 69, 178, 0.4);
	}

	h3 {
		font-family: 'Orbitron', sans-serif;
		font-size: 24px;
		color: #fff;
		margin-bottom: 10px;
		text-shadow: 0 0 5px rgba(164, 69, 178, 0.7);
	}

	p {
		font-family: 'Inter', sans-serif;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
		user-select: none;
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

export const PongPaddleBackground = styled(motion.div)`
	position: absolute;
	top: 250px;
	width: 600px;
	height: 120px;
	background: linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgba(200, 200, 200, 0.4) 100%);
	border-radius: 400px;
	animation: ${floatPaddleAnimation} 4s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
	opacity: 0.8;
	box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05);
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

export const PongBallBackground = styled(motion.div)`
	position: absolute;
	bottom: 100px;
	width: 160px;
	height: 160px;
	background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.7), rgba(200, 200, 200, 0.4));
	border-radius: 50%;
	animation: ${floatBallAnimation} 6s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
	opacity: 0.8;
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.1);
`;
