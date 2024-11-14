import styled from "styled-components";

export const AvailableTournamentsSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	color: #fff;
	padding: 2rem;
	margin-top: 2rem;
	gap: 30px;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const Title = styled.h1`
	font-size: 2.5rem;
	font-family: 'Orbitron', sans-serif;
	margin-bottom: 1.5rem;
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

export const AvailableTournamentsContainer = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	width: 1200px;
	padding: 2rem;
	overflow-y: auto;
	height: 500px;
	scroll-behavior: smooth;
`;

export const SearchContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 1200px;
	position: relative;
	margin-bottom: 1rem;
`;

export const SearchBar = styled.input`
	width: 600px;
	padding: 1rem;
	border-radius: 8px;
	border: 1px solid #444;
	background-color: #1a1a1a;
	color: #fff;
	font-size: 1rem;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);

	&::placeholder {
		color: #888;
	}

	&:focus {
		outline: none;
		border-color: #fff;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
		background-color: #2a2a2a;
	}
`;

export const TournamentList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	width: 100%;
	padding-bottom: 2rem;

	& > p {
		width: 100%;
		text-align: center;
		color: #ccc;
	}
`;

export const TournamentCard = styled.div`
	background-color: #222;
	border-radius: 15px;
	padding: 1.5rem;
	text-align: center;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	user-select: none;

	h3 {
		font-size: 1.4rem;
		margin-bottom: 0.8rem;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	p {
		color: #aaa;
		font-size: 1.1rem;
		margin-bottom: 1.2rem;
	}

	&:hover {
		transform: translateY(-6px);
		background-color: #333;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}
`;

export const BackButton = styled.button`
	position: absolute;
	left: 20px;
	padding: 0.5rem 1rem;
	background: none;
	color: rgba(255, 255, 255, 0.8);
	border: none;
	border-radius: 8px;
	font-size: 2rem;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		color: rgba(255, 255, 255, 0.4);
	}

	&:focus {
		outline: none;
	}
`;
