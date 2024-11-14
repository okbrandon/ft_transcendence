import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

export const FormContainer = styled(Form)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border-radius: 25px;
	width: 600px;
	padding: 50px 50px;
	background-color: #171717;
	border: 1px solid #3d0066;
	transition: 0.4s ease-in-out;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1000;

	& > h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
		color: white;
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
