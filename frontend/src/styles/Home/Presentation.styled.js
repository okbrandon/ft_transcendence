import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const PresentationSection = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 700px;
	width: 100%;
	z-index: 100;

	background-color: #000;
	background-image: linear-gradient(
		-90deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.7) calc(5em - 1px + 5px),
		rgba(255, 255, 255, 0.7) 5em
	),
	linear-gradient(
		0deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.7) calc(5em - 1px + 5px),
		rgba(255, 255, 255, 0.7) 5em
	);
	background-size: 5em 5em;
`;

export const PresentationDiv = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 600px;
	line-height: 2;
	letter-spacing: 1px;

	& > h1 {
		color: #fff;
		font-family: 'VT323';
		font-size: 90px;
		margin-bottom: 50px;
		z-index: 100;
	}

	& > p {
		font-size: 20px;
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
	top: 270px;
	left: -50px;
	width: 800px;
	height: 150px;
	background-repeat: no-repeat;
	background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(120,120,120,1) 100%);
	border-radius: 400px;
	transform: rotate(-50deg);
	animation: ${floatPaddleAnimation} 2s ease-in-out infinite forwards;
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
	bottom: 150px;
	right: 300px;
	width: 180px;
	height: 180px;
	background-repeat: no-repeat;
	background: linear-gradient(120deg, rgba(255,255,255,1) 0%, rgba(120,120,120,1) 100%);
	border-radius: 50%;
	animation: ${floatBallAnimation} 3s ease-in-out infinite forwards;
	overflow: hidden;
	z-index: -1;
`;
