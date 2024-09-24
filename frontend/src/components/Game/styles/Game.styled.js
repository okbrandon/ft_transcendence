import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const ScoreContainer = styled.div`
	position: absolute;
	top: 10px;
	width: 100%;
	display: flex;
	justify-content: center;
	gap: 120px;
	padding: 0 40px;
	font-family: 'Orbitron', sans-serif;
	color: #fff;
`;

export const Score = styled.div`
	font-size: 5rem;
	font-weight: bold;
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
`;

export const LeaveButton = styled.button`
	position: absolute;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 10px 20px;
	border: none;
	border-radius: 20px;

	&:hover {
		background: rgba(200, 200, 200, 1);
	}
`;

export const ProfilesContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 1200px;
	margin-bottom: 20px;

	& > p {
		font-size: 1.5rem;
		font-family: 'Orbitron', sans-serif;
		color: rgba(255, 255, 255, 0.2);
		position: relative;
		background-clip: text;
		-webkit-background-clip: text;
	}
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
`;

export const ProfileName = styled.h2`
	font-family: 'Orbitron', sans-serif;
	font-size: 2rem;
	color: #fff;
`;

export const GameContainer = styled.div`
	position: relative;
	border: 3px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	width: 1200px;
	height: 750px;
	background: radial-gradient(circle, rgba(20, 20, 20, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%);
	box-shadow: 0 0 20px rgba(164, 69, 178, 0.7), 0 0 30px rgba(59, 130, 246, 0.4);
	overflow: hidden;
	margin: 0 auto;
`;

export const GameSeparator = styled.div`
	position: absolute;
	height: 100%;
	left: 50%;
	transform: translateX(-50%);
	border-left: 2px dashed rgba(255, 255, 255, 0.4);
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
`;

export const PongBall = styled.div`
	position: absolute;
	width: 25px;
	height: 25px;
	${({ x, y }) => `left: ${x}px; top: ${y}px;`};
	border-radius: 50%;
	background: radial-gradient(circle, #ffffff, rgba(255, 255, 255, 1));
	box-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
	transition: transform 0.1s ease-out;
`;

export const PongPaddle = styled.div`
	position: absolute;
	${({ $side }) => ($side === 'left' ? 'left: 10px;' : 'right: 10px;')}
	${({ $side, $leftPaddleTop, $rightPaddleTop }) =>
		$side === 'left' ? `top: ${$leftPaddleTop}px;` : `top: ${$rightPaddleTop}px`};
	width: 20px;
	height: 120px;
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
	border-radius: 10px;
	box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
	transition: top 0.1s ease-out;
	overflow: hidden;
`;
