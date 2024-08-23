import styled from "styled-components";

export const TournamentOptionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: #000;
	color: #fff;
	text-align: center;
	padding: 2rem;

	h1 {
		font-family: "Orbitron", sans-serif;
		font-size: 2.5rem;
		margin-bottom: 3rem;
		font-weight: bold;
		color: #fff;
	}
`;

export const OptionButton = styled.button`
	background-color: #111;
	color: #fff;
	border: 2px solid #555;
	border-radius: 15px;
	padding: 1.5rem 3rem;
	margin-bottom: 2rem;
	cursor: pointer;
	font-size: 1.5rem;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 8px rgba(255, 255, 255, 0.1);
	width: 80%;
	max-width: 500px;
	text-align: center;

	&:hover {
		background-color: #222;
		border-color: #fff;
		box-shadow: 0px 8px 16px rgba(255, 255, 255, 0.2);
	}
`;

export const OptionDescription = styled.p`
	margin-top: 1rem;
	font-size: 1rem;
	color: #bbb;
`;

export const BackButton = styled.button`
	position: absolute;
	top: 90px;
	left: 20px;
	padding: 0.5rem 1rem;
	background-color: #444;
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);

	&:hover {
		background-color: #555;
		box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
	}

	&:focus {
		outline: none;
	}
`;
