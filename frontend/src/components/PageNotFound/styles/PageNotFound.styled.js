import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	color: #ffffff;
	text-align: center;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;

	h1 {
		font-family: "Inter", sans-serif;
		font-size: 8rem;
	}
`;

export const PongContainer = styled.div`
	position: relative;
	border: 2px solid rgba(255, 255, 255, 0.2);
	margin-bottom: 2rem;
`;

export const BrokenText = styled.div`
	position: absolute;
	left: 50%;
	top: 50%;
	font-size: 5rem;
	font-family: "VT323", cursive;
	color: rgba(255, 255, 255, 0.3);
	transform: translate(-50%, -50%);
`;

export const Message = styled.h2`
	font-family: "Roboto", sans-serif;
	margin-bottom: 2rem;
	font-size: 1.5rem;
`;

export const ReturnButton = styled(Link)`
	background: #ffffff;
	color: #101010;
	padding: 0.8rem 2rem;
	font-size: 1rem;
	border-radius: 8px;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.3);

	&:hover {
		background: #f0f0f0;
		box-shadow: 0px 6px 20px rgba(255, 255, 255, 0.5);
	}
`;
