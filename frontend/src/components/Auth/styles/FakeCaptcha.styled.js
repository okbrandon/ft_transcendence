import styled, { keyframes } from 'styled-components';

export const FakeCaptchaContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 0 7em 3em 7em;
	border-radius: 25px;
	transition: 0.4s ease-in-out;
	padding: 50px;
	width: 600px;
	font-family: 'Inter', sans-serif;
	background-color: #171717;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 15px rgba(164, 69, 178, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);
	position: relative;

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

	& > i {
		position: absolute;
		top: 20px;
		left: 25px;
		color: white;
		font-size: 1.5rem;

		&:hover {
			color: #ababab;
			cursor: pointer;
		}
	}
`;

export const FakeCaptchaInput = styled.div`
	font-size: 1.5rem;
	margin-bottom: 10px;
	font-family: 'monospace';
	letter-spacing: 0.1rem;
`;

export const HiddenInput = styled.input`
	opacity: 0;
	position: absolute;
`;

export const blink = keyframes`
	to {
		visibility: hidden;
	}
`;

export const Cursor = styled.span`
	border-right: 2px solid white;
	animation: ${blink} 1s steps(2, start) infinite;
`;
