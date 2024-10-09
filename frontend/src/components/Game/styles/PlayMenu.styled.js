import styled from "styled-components";

export const PlayMenuContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 5rem;
	height: 100vh;
	width: 100%;
	padding: 2rem;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const Title = styled.h1`
	font-size: 3rem;
	font-family: 'Orbitron', sans-serif;
	margin-bottom: 2rem;
	text-transform: uppercase;
	letter-spacing: 5px;
	background: linear-gradient(135deg, #ff00ff, #00ffff);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow:
		0 0 10px rgba(255, 255, 255, 0.6),
		0 0 15px rgba(128, 0, 128, 0.4),
		0 0 20px rgba(75, 0, 130, 0.3);
`;

export const ModesContainer = styled.div`
	display: flex;
	gap: 4rem;
`;

export const ModeCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	width: 250px;
	height: 250px;
	background: #1a1a1a;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.2);
	transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
	user-select: none;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 16px rgba(164, 69, 178, 0.4), 0 0 12px rgba(59, 130, 246, 0.4);
		cursor: pointer;
	}

	h1 {
		text-transform: uppercase;
		letter-spacing: 5px;
		font-size: 1.6rem;
		color: rgba(255, 255, 255, 0.7);
	}
`;
