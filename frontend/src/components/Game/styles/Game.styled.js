import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background:
		radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
		radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
		linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
	padding-bottom: 40px;
`;

export const GameSceneContainer = styled.div`
	position: relative;
	border: 3px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	width: 1200px;
	height: 750px;
	box-shadow: 0 0 20px rgba(164, 69, 178, 0.7), 0 0 30px rgba(59, 130, 246, 0.4);
	overflow: hidden;
	margin: 0 auto;

	@keyframes borderHit {
		0% {
			border: 3px solid rgba(255, 255, 255, 0.7);
			box-shadow: 0 0 30px rgba(164, 69, 178, 1), 0 0 40px rgba(59, 130, 246, 0.8);
		}
		50% {
			border: 3px solid rgba(255, 255, 255, 0.4);
			box-shadow: 0 0 25px rgba(164, 69, 178, 0.8), 0 0 35px rgba(59, 130, 246, 0.6);
		}
		100% {
			border: 3px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 0 20px rgba(164, 69, 178, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
		}
	}

	@keyframes borderHitGreen {
		0% {
			border: 3px solid rgba(50, 205, 50, 0.7);
			box-shadow: 0 0 30px rgba(50, 205, 50, 1), 0 0 40px rgba(34, 139, 34, 0.8);
			transform: scale(1.005);
		}
		100% {
			border: 3px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 0 20px rgba(164, 69, 178, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
			transform: scale(1);
		}
	}

	@keyframes borderHitRed {
		0% {
			border: 3px solid rgba(255, 0, 0, 0.7);
			box-shadow: 0 0 30px rgba(255, 0, 0, 1), 0 0 40px rgba(139, 0, 0, 0.8);
			transform: scale(1.005);
		}
		100% {
			border: 3px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 0 20px rgba(164, 69, 178, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
			transform: scale(1);
		}
	}

	&.hit {
		animation: borderHit 0.5s ease-in-out;
	}

	&.green {
		animation: borderHitGreen 0.5s ease-in-out;
	}

	&.red {
		animation: borderHitRed 0.5s ease-in-out;
	}
`;

export const StyledCanvas = styled.canvas`
	width: 100%;
	height: 100%;
`;

export const ScoresContainer = styled.div`
	position: absolute;
	top: 10px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 120px;
	font-family: 'Orbitron', sans-serif;
	color: #fff;
`;

export const Score = styled.div`
	font-size: 5rem;
	font-weight: bold;
	color: #ffffff;

	text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5),
	             0 0 30px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2);
`;

export const ProfilesContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 1200px;
	margin-bottom: 20px;
	position: relative;

	p {
		font-size: 1.5rem;
		font-family: 'Orbitron', sans-serif;
		color: rgba(255, 255, 255, 0.2);
		position: relative;
		background-clip: text;
		-webkit-background-clip: text;
	}
`;

export const PressQContainer = styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
`;

export const Profile = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
`;

export const ProfileImage = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
`;

export const ProfileName = styled.h2`
	font-family: 'Orbitron', sans-serif;
	font-size: 2rem;
	color: #fff;
`;

export const OverlayContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	z-index: 100;

	h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 3rem;
		color: #fff;
	}

	p {
		font-family: 'Orbitron', sans-serif;
		font-size: 2rem;
		color: #fff;
	}
`;

export const RewardsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	background-color: rgba(25, 25, 25, 1);
	padding: 40px 50px;
	border-radius: 10px;

	& > p {
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 180px auto;
		font-family: 'Poppins', sans-serif;
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		align-items: center;

		.label {
			font-weight: 500;
		}
	}

	i {
		color: #FFD700;
	}
`;

export const Timer = styled.div`
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	color: #fff;
	z-index: 100;
`;
