import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const WinnerPageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
`;

export const WinnerContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(5, 5, 5, 0.8);
	margin: 20px auto;
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 20px;
	border-radius: 20px;
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.3);
	max-width: 1200px;
`;

export const WinnerText = styled.h1`
	font-size: 2rem;
	color: #fff;
	animation: ${fadeIn} 1s ease-in-out;
`;

export const WinnerImage = styled.img`
	width: 100%;
	max-width: 400px;
	margin-top: 20px;
	border-radius: 20px;
	object-fit: cover;
	object-position: center;
	animation: ${fadeIn} 1s ease-in-out;
`;

export const WinnerUsername = styled.h2`
	font-size: 1.5rem;
	color: #fff;
	animation: ${fadeIn} 1s ease-in-out;
`;

export const WinnerPrize = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	animation: ${fadeIn} 1s ease-in-out;
`;
