import styled, { keyframes } from "styled-components";

export const BannerSection = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	z-index: 100;
	min-height: 90vh;
	background: linear-gradient(80deg, rgba(150, 93, 233, 0.15) 10%, rgba(99, 88, 238, 0.15) 95%);
	border-bottom: 5px solid #fff;

	& > h1 {
		font-family: 'Orbitron', serif;
		font-size: 90px;
		z-index: 100;
		margin-bottom: 30px;
	}
`;

const totalPaddles = 6;

const BannerPaddle = styled.div`
	position: absolute;
	width: 70px;
	height: 350px;
	bottom: -40vh;
	background: linear-gradient(90deg, rgba(150, 150, 150, 0.7) 10%, rgba(255, 255, 255, 0.7) 95%);
	border-radius: 100px;
`;

const getRotationAnimation = (scale, rotation) => keyframes`
	100% {
		transform: scale(${scale}) rotate(${rotation}deg);
		bottom: 90vh;
	}
`;

const StyledBannerPaddle = styled(BannerPaddle)`
	left: ${props => props.$left}%;
	filter: blur(${props => props.$blurPx}px);
	transform: scale(${props => 0.3 * props.$i - 0.6});
	animation: ${props => getRotationAnimation(0.3 * props.$i - 0.6, props.$dir)} ${props => props.$animationDuration}s linear infinite;
	animation-delay: ${props => props.$animationDelay}s;
`;

export const BannerPaddles = () => {
	const paddles = [];

	for (let i = 1; i <= totalPaddles + 1; i++) {
		const left = i % 2 ? Math.random() * 45 : 55 + Math.random() * 30;
		const animationDuration = 6 + Math.random() * 15;
		const animationDelay = Math.random() * 6;
		const blurPx = i * 2;

		const paddle = (
			<StyledBannerPaddle
				key={i}
				$left={left}
				$i={i}
				$dir={Math.floor(Math.random() * 2) ? 360 : -360}
				$blurPx={blurPx}
				$animationDuration={animationDuration}
				$animationDelay={animationDelay}
			/>
		);

		paddles.push(paddle);
	}

	return (
		<>
			{paddles}
		</>
	);
};
