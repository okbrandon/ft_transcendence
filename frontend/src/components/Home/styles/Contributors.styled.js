import styled from 'styled-components';

export const ContributorsContainer = styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	color: #fff;
	width: 100%;
	height: 65vh;
	text-align: center;
	background:
				linear-gradient(180deg, rgb(0,0,0) 0%, rgba(0,0,0,0.8) 2%, rgba(0,0,0,0.5) 5%, transparent 15%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%);
	background-size: cover;
	background-position: center;
`;

export const Title = styled.h1`
	font-family: "Orbitron", sans-serif;
	font-size: 60px;
	margin-bottom: 10px;
	background: linear-gradient(135deg, #6a0dad, #a445b2);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow:
			0 0 4px rgba(164, 69, 178, 0.8),
			0 0 8px rgba(128, 0, 128, 0.5);
`;

export const SubTitle = styled.h2`
	font-family: "Orbitron", sans-serif;
	font-size: 30px;
	letter-spacing: 1.5px;
	margin-bottom: 50px;
	color: rgba(255, 255, 255, 0.8);
`;

export const CardsContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 90%;
	max-width: 1200px;
	flex-wrap: wrap;
`;

export const Cards = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 2rem;
	width: 100%;
`;

export const Card = styled.div`
	background-color: rgba(30, 30, 50, 0.9);
	padding: 30px;
	border-radius: 15px;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(128, 0, 128, 0.3);
	border: 1px solid rgba(164, 69, 178, 0.5);
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	cursor: pointer;

	&:hover {
		transform: scale(1.08);
		box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15), 0 0 20px rgba(128, 0, 128, 0.5);
	}

	img {
		border-radius: 50%;
		width: 120px;
		height: 120px;
		object-fit: cover;
		margin-bottom: 20px;
	}

	h3 {
		font-family: "Orbitron", sans-serif;
		font-size: 22px;
		color: #fff;
		margin-bottom: 10px;
		text-transform: uppercase;
		letter-spacing: 1.5px;
	}

	p {
		font-family: "Inter", sans-serif;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 0;
		font-weight: 400;
	}
`;
