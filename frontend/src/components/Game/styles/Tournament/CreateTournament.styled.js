import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: calc(80px + 2rem);
	color: #fff;
	height: 100vh;
	width: 100%;
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

export const TournamentForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	padding: 2.5rem 3.5rem;
	border-radius: 20px;
	background: linear-gradient(145deg, #111, #222);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	width: 600px;
	max-width: 90%;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 0.5rem;
`;

export const FormLabel = styled.label`
	font-size: 1.1rem;
	color: #ccc;
	margin-bottom: 0.7rem;
	font-weight: 500;
`;

export const FormControl = styled.input`
	width: 100%;
	padding: 0.8rem;
	border: 1px solid #555;
	border-radius: 8px;
	background-color: #111;
	color: #fff;
	font-size: 1rem;
	transition: all 0.3s ease;
	margin-bottom: 1rem;

	&:focus {
		outline: none;
		border-color: #fff;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}
`;

export const FormSelect = styled.select`
	width: 100%;
	padding: 0.8rem;
	border: 1px solid #555;
	border-radius: 8px;
	background-color: #111;
	color: #fff;
	font-size: 1rem;
	transition: all 0.3s ease;
	margin-bottom: 1rem;

	&:focus {
		outline: none;
		border-color: #fff;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}
`;
