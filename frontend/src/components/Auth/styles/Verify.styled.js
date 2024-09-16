import styled from "styled-components";

export const VerificationContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background: linear-gradient(135deg, #000 0%, #111 100%);
	color: #fff;
	font-family: 'Poppins', sans-serif;
`;

export const VerificationTitle = styled.h1`
	font-size: 2.5rem;
	font-family: 'Orbitron', sans-serif;
	color: rgba(164, 69, 178, 0.9);
	text-align: center;
	text-transform: uppercase;
	margin-top: 10rem;
	margin-bottom: 1rem;
	letter-spacing: 1.5px;
`;

export const VerificationMessage = styled.p`
	font-size: 1.2rem;
	color: rgba(255, 255, 255, 0.85);
	text-align: center;
	max-width: 600px;
	margin-bottom: 2rem;
	line-height: 1.5;
`;
