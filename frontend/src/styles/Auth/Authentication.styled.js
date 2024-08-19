import styled from "styled-components";
import Form from 'react-bootstrap/Form';

export const AuthenticationContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
`;

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	border-radius: 15px;
	width: 700px;
	height: 700px;
	font-family: 'Inter', sans-serif;
	border: 1px solid white;

	& > h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 3.5rem;
		margin-bottom: 50px;
	}

	& > p {
		color: #ababab;
		font-size: 13px;
		z-index: 2;
	}

	& .mb-3 {
		width: 250px;
		position: relative;
	}

	.mb-3 input {
		width: 100%;
		padding: 10px;
		outline: none;
		border: none;
		font-size: 1rem;
		background: transparent;
		border-left: 2px solid #fff;
		border-bottom: 2px solid #fff;
		transition: 0.1s;
		border-radius: 0;
		border-bottom-left-radius: 8px;
		color: #fff;

		&:focus {
			outline: none;
			box-shadow: none;
		}
	}

	.mb-3 span {
		margin-top: 5px;
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-4px);
		margin-left: 10px;
		padding: 10px;
		pointer-events: none;
		font-size: 1rem;
		text-transform: uppercase;
		transition: 0.5s;
		letter-spacing: 3px;
		border-radius: 8px;
	}

	.mb-3 input:valid ~ span,
	.mb-3 input:focus ~ span {
		transform: translateX(113px) translateY(-25px);
		font-size: 0.8rem;
		padding: 5px 10px;
		background: #fff;
		letter-spacing: 0.2rem;
		color: #000;
		border: 2px;
		font-weight: 600;
	}

	.mb-3 input:valid,
	.mb-3 input:focus {
		border: 2px solid #fff;
		border-radius: 8px;
	}

	& button {
		z-index: 1;
	}
`;
