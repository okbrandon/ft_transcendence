import styled, { keyframes } from "styled-components";
import React from "react";

const total = 6;

const BannerPaddle = styled.div`
	position: absolute;
	width: 70px;
	height: 350px;
	bottom: -50vh;
	background-color: white;
	border-radius: 100px;
`;

const getRotationAnimation = (scale, rotation) => keyframes`
	100% {
		transform: scale(${scale}) rotate(${rotation}deg);
		bottom: 150vh;
	}
`;

const StyledBannerPaddle = styled(BannerPaddle)`
	left: ${props => props.$left}%;
	z-index: ${props => props.$i + 7};
	filter: blur(${props => props.$blurPx}px);
	transform: scale(${props => 0.3 * props.$i - 0.6});

	animation:  ${props => getRotationAnimation(0.3 * props.$i - 0.6, props.$dir)} ${props => props.$animationDuration}s linear infinite;
	animation-delay: ${props => props.$animationDelay}s;
`;

const BannerPaddles = () => {
	const paddles = [];
	const leftValues = Array.from({length: total}, (_, i) => 80 / total * (i + 1));

	// Fisher-Yates (Knuth) Shuffle algorithm for leftValues
	for (let i = leftValues.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[leftValues[i], leftValues[j]] = [leftValues[j], leftValues[i]];
	}

	for (let i = 1; i <= total; i++) {
		const left = leftValues[i - 1];
		const animationDuration = 6 + Math.random() * 15;
		const animationDelay = Math.random() * 5 - 5;
		const blurPx = i * 5;

		const paddle = (
			<StyledBannerPaddle
				key={i}
				$left={left}
				$i={i}
				$dir={i % 2  ? 360 : -360}
				$blurPx={blurPx}
				$animationDuration={animationDuration}
				$animationDelay={animationDelay}
			/>
		);

		paddles.push(paddle);
	}
  
	return <>{paddles}</>;
};

export default BannerPaddles;
