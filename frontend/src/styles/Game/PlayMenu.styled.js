import styled from "styled-components";

export const PlayMenuContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	height: 100vh;
	width: 100%;
	padding: 2rem;
	background: linear-gradient(135deg, #000 0%, #111 100%);
	background-size: cover;
`;

export const PlayMenuCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px solid #fff;
	border-radius: 15px;
	width: 300px;
	height: 300px;
	background: #111;
	box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
	transition: transform 0.3s ease, background-color 0.3s ease;
	user-select: none;

	&:hover {
		background-color: #222;
		transform: translateY(-10px);
		box-shadow: 0 12px 24px rgba(255, 255, 255, 0.3);
		cursor: pointer;
	}
	
	h1 {
		text-transform: uppercase;
		letter-spacing: 8px;
		color: #fff;
		font-size: 1.5rem;
	}
`;
