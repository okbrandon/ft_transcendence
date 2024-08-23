import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const PresentationSection = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100%;
	z-index: 100;
	padding: 40px 20px;
	border-bottom: 1px solid #fff;

	background-color: #0e0e0e;
	background-image: linear-gradient(
		-90deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.1) calc(5em - 1px + 2px),
		rgba(255, 255, 255, 0.1) 5em
	),
	linear-gradient(
		0deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.1) calc(5em - 1px + 2px),
		rgba(255, 255, 255, 0.1) 5em
	);
	background-size: 5em 5em;
`;

export const PresentationDiv = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	max-width: 900px;
	line-height: 1.8;
	letter-spacing: 1px;
	text-align: center;

	& > h1 {
		color: #fff;
		font-family: 'VT323', monospace;
		font-size: 80px;
		margin-bottom: 30px;
		text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
	}

	& > p {
		font-size: 20px;
		color: rgba(255, 255, 255, 0.85);
		font-family: 'Inter', sans-serif;
		margin-bottom: 40px;
		max-width: 700px;
		line-height: 1.6;
	}
`;

export const FeaturesContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	width: 100%;
	max-width: 900px;
`;

export const FeatureItem = styled.div`
	background-color: #121212;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	border: 1px solid rgba(255, 255, 255, 0.1);

	&:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 15px rgba(255, 255, 255, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	h3 {
		font-family: 'Orbitron', sans-serif;
		font-size: 22px;
		color: #ffffff;
		margin-bottom: 20px;
	}

	p {
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
		user-select: none;
	}
`;

const floatPaddleAnimation = keyframes`
	0% {
		transform: translateY(0px) rotate(-50deg);
	}
	50% {
		transform: translateY(10px) rotate(-50deg);
	}
	100% {
		transform: translateY(0px) rotate(-50deg);
	}
`;

export const PongPaddleBackground = styled(motion.div)`
	position: absolute;
	top: 22rem;
	width: 800px;
	height: 150px;
	background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(120,120,120,1) 100%);
	border-radius: 400px;
	transform: rotate(-50deg);
	animation: ${floatPaddleAnimation} 4s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
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
	bottom: 25rem;
	width: 180px;
	height: 180px;
	background: linear-gradient(120deg, rgba(255,255,255,1) 0%, rgba(120,120,120,1) 100%);
	border-radius: 50%;
	animation: ${floatBallAnimation} 6s ease-in-out infinite;
	overflow: hidden;
	z-index: -1;
`;
