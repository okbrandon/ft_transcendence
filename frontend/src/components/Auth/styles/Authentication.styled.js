import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export const AuthenticationSection = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%);
	background-size: cover;
	background-position: center;
`;

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	border-radius: 15px;
	width: 600px;
	padding: 50px 50px;
	margin-top: 80px;
	font-family: 'Inter', sans-serif;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 15px rgba(164, 69, 178, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);

	& > h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 2.5rem;
		margin-bottom: 20px;
		text-shadow: 0px 4px 10px rgba(164, 69, 178, 0.7);
	}

	& > p {
		color: #ababab;
		font-size: 13px;
		z-index: 2;
	}

	& .mb-3 {
		width: 100%;
		position: relative;
		margin: 10px 0;
	}

	.mb-3 input {
		width: 100%;
		padding: 10px;
		outline: none;
		border: none;
		font-size: 1rem;
		background: transparent;
		border-left: 2px solid rgba(255, 255, 255, 0.3);
		border-bottom: 2px solid rgba(255, 255, 255, 0.3);
		transition: 0.3s ease;
		border-radius: 0;
		border-bottom-left-radius: 8px;
		color: #fff;

		&:focus {
			outline: none;
			box-shadow: none;
			border-left: 2px solid #a445b2;
			border-bottom: 2px solid #a445b2;
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
		transition: 0.5s ease;
		letter-spacing: 3px;
		border-radius: 8px;
	}

	.mb-3 input:not(:placeholder-shown) ~ span,
	.mb-3 input:invalid ~ span,
	.mb-3 input:focus ~ span {
		transform: translateX(350px) translateY(-25px);
		font-size: 0.8rem;
		padding: 5px 10px;
		background: #fff;
		letter-spacing: 0.2rem;
		color: #000;
		border: 2px;
		font-weight: 600;
	}

	.mb-3 input:not(:placeholder-shown),
	.mb-3 input:focus {
		border: 2px solid #fff;
		border-radius: 8px;
	}

	.mb-3 input:invalid {
		border: 2px solid #ff0000;
		border-radius: 8px;
	}

	& button {
		z-index: 1;
		width: 100%;
	}
`;

export const FortyTwoButton = styled(Button)`
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	letter-spacing: 2px;
	z-index: 1;
	outline: none;
	width: 100%;
	margin-bottom: 15px;
	border-radius: 8px;

	& > img {
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
`;

export const ErrorMessage = styled.p`
	font-size: 1rem;
	font-weight: 600;
	color: #ff0000 !important;
`;
