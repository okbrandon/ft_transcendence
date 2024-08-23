import styled from 'styled-components';

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;

	& > h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 48px;
		margin-bottom: 50px;
		color: #fff;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5);
	}
`;

export const VsAiContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 60%;
	max-width: 900px;
	margin-bottom: 30px;

	& > p {
		font-family: 'Orbitron', sans-serif;
		font-size: 36px;
		margin: 0 20px;
		color: #fff;
		text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
	}
`;

export const PlayersContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 300px;
	height: 150px;
	border: 2px solid rgba(255, 255, 255, 0.5);
	border-radius: 10px;
	font-family: 'Inter', sans-serif;
	font-size: 24px;
	color: #fff;
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);

	img {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-bottom: 10px;
		margin-right: 20px;
		object-fit: cover;
	}

	.spinner-border {
		margin-left: 15px;
		margin-bottom: 13px;
	}
`;

export const ButtonsContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 500px;
	margin-top: 30px;

	button {
		font-family: 'Orbitron', sans-serif;
		font-size: 20px;
		padding: 10px 20px;
		margin: 10px 0;
		background: linear-gradient(135deg, #333, #555);
		color: #fff;
		border: none;
		border-radius: 30px;
		cursor: pointer;
		box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;

		&:hover {
			transform: scale(1.05);
			background: linear-gradient(135deg, #555, #777);
			box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
		}

		&:active {
			transform: scale(0.95);
			background: linear-gradient(135deg, #222, #444);
		}
	}
`;
