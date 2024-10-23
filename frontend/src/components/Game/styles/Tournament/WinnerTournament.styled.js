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
	background: radial-gradient(circle at 30% 30%, rgba(75, 0, 130, 0.25), transparent 40%),
				radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.25), transparent 40%),
				linear-gradient(135deg, #111111 0%, #222222 100%);
	padding: 20px;
	text-align: center;

	@media (max-width: 768px) {
		padding: 10px;
	}
`;

export const WinnerText = styled.h1`
	font-size: 2.5rem;
	color: #fff;
	text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
	margin-bottom: 20px;
	animation: ${fadeIn} 2s ease-in-out;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`;

export const WinnerContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	background: rgba(15, 15, 15, 0.85);
	margin: 20px auto;
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 30px;
	border-radius: 20px;
	box-shadow: 0 8px 30px rgba(255, 255, 255, 0.1), 0 0 20px rgba(164, 69, 178, 0.3);
	max-width: 1200px;
	animation: ${fadeIn} 2s ease-in-out;

	@media (max-width: 768px) {
		padding: 20px;
	}
`;

export const WinnerImage = styled.img`
	width: 250px;
	height: 250px;
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
	margin-bottom: 20px;
	border: 2px solid #6a0dad;
	animation: ${fadeIn} 2s ease-in-out;

	@media (max-width: 768px) {
		width: 200px;
		height: 200px;
	}
`;

export const WinnerUsername = styled.h2`
	font-size: 2rem;
	color: #fff;
	margin-bottom: 10px;
	text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
	animation: ${fadeIn} 1.5s ease-in-out;

	@media (max-width: 768px) {
		font-size: 1.5rem;
	}
`;

export const WinnerPrize = styled.div`
	font-size: 1.25rem;
	color: #ffd700;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
	animation: ${fadeIn} 1s ease-in-out;

	@media (max-width: 768px) {
		font-size: 1rem;
	}
`;
