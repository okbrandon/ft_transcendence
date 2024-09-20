import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	border-radius: 15px;
	width: 600px;
	padding: 50px 50px;
	font-family: 'Inter', sans-serif;
	background: #000;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 15px rgba(164, 69, 178, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1000;

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

	& button {
		z-index: 1;
		width: 100%;
	}
`;

export const Backdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.7);
	z-index: 999;
	pointer-events: all;
`;
