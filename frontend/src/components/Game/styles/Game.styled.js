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
`;

export const GameContainer = styled.div`
	position: relative;
	border: 3px solid rgba(255, 255, 255, 0.2);
	border-radius: 20px;
	width: 1200px;
	height: 750px;
	box-shadow: 0 0 20px rgba(164, 69, 178, 0.7), 0 0 30px rgba(59, 130, 246, 0.4);
	overflow: hidden;
	margin: 0 auto;
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
	font-family: 'Orbitron'	, sans-serif;
	color: #fff;
	z-index: 100000;
`;

export const Score = styled.div`
	font-size: 5rem;
	font-weight: bold;
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
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
	object-fit: cover;
`;

export const ProfileName = styled.h2`
	font-family: 'Orbitron', sans-serif;
	font-size: 2rem;
	color: #fff;
`;
