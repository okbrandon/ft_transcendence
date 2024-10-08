import styled from "styled-components";

export const TournamentOptionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	color: #fff;
	text-align: center;
	padding: 2rem;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;

	h1 {
		font-size: 3rem;
		font-family: 'Orbitron', sans-serif;
		margin-bottom: 5rem;
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
	}
`;

export const OptionButton = styled.button`
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 5px;
	border-radius: 15px;
	border: none;
	background-color: #1a1a1a;
	padding: 1.5rem 3rem;
	margin-bottom: 2rem;
	cursor: pointer;
	font-size: 1.5rem;
	transition: all 0.3s ease;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.2);
	width: 80%;
	max-width: 500px;
	text-align: center;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 16px rgba(164, 69, 178, 0.4), 0 0 12px rgba(59, 130, 246, 0.4);
	}

	& > p {
		margin-top: 20px;
		font-size: 1rem;
		text-transform: none;
		color: rgba(255, 255, 255, 0.5);
	}
`;
