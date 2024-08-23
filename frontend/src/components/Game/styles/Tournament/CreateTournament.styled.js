import styled from "styled-components";
import Form from "react-bootstrap/Form";

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background-color: #000;
	color: #fff;
	height: 100vh;
	width: 100%;

	h1 {
		font-family: "Orbitron", sans-serif;
		margin-bottom: 1.5rem;
		font-size: 2.5rem;
		color: #ffffff;
		text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
	}
`;

export const TournamentForm = styled(Form)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2.5rem 3.5rem;
	border: 1px solid #444;
	border-radius: 20px;
	background: linear-gradient(145deg, #111, #222);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	width: 600px;
	max-width: 90%;

	& > * {
		margin-bottom: 1.5rem;
		width: 100%;
	}

	label {
		font-size: 1.1rem;
		color: #ccc;
		margin-bottom: 0.7rem;
		font-weight: 500;
	}

	input, select {
		width: 100%;
		padding: 0.8rem;
		border: 1px solid #555;
		border-radius: 8px;
		background-color: #111;
		color: #fff;
		font-size: 1rem;
		transition: all 0.3s ease;

		&:focus {
			outline: none;
			border-color: #fff;
			box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
		}
	}

	button {
		padding: 0.8rem 2rem;
		border: none;
		border-radius: 10px;
		background-color: #444;
		color: #fff;
		font-size: 1.1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

		&:hover {
			background-color: #555;
			box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
		}
	}
`;
