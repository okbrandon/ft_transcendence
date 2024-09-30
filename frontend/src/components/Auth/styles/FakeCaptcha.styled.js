import styled, { keyframes } from 'styled-components';

export const FakeCaptchaContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
	border-radius: 15px;
	padding: 50px;
	width: 600px;
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
