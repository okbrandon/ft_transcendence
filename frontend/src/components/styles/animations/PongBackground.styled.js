import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

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

export const PongPaddleBackground = styled(motion.div)`
	position: absolute;
	top: 250px;
	left: -50px;
	width: 800px;
	height: 150px;
	background-repeat: no-repeat;
	background: linear-gradient(0deg, rgba(150,150,150,1) 0%, rgba(20,20,20,1) 100%);
	border-radius: 400px;
	transform: rotate(-40deg);
	animation: ${floatBarAnimation} 2s ease-in-out infinite forwards;
	overflow: hidden;
	z-index: -1;
`;

export const PongBallBackground = styled(motion.div)`
	position: absolute;
	bottom: 150px;
	right: 300px;
	width: 180px;
	height: 180px;
	background-repeat: no-repeat;
	background: linear-gradient(133deg, rgba(150,150,150,1) 0%, rgba(20,20,20,1) 100%);
	border-radius: 50%;
	animation: ${floatBallAnimation} 3s ease-in-out infinite forwards;
	overflow: hidden;
	z-index: -1;
`;
