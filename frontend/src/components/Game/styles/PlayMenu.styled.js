import styled from "styled-components";

export const PlayMenuContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	height: 100vh;
	width: 100%;
	padding: 2rem;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const PlayMenuCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;
	width: 300px;
	height: 300px;
	background: #111;
	box-shadow: 0 8px 16px rgba(164, 69, 178, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
	transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
	user-select: none;

	&:hover {
		background-color: #222;
		transform: translateY(-10px);
		box-shadow: 0 12px 24px rgba(164, 69, 178, 0.7), 0 0 20px rgba(59, 130, 246, 0.5);
		cursor: pointer;
	}

	h1 {
		text-transform: uppercase;
		letter-spacing: 8px;
		color: #fff;
		font-size: 1.5rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(164, 69, 178, 0.7));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
`;
