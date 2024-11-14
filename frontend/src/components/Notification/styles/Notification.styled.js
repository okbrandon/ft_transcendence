import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
	0% {
		transform: translateY(100%);
		opacity: 0;
	}
	100% {
		transform: translateY(0);
		opacity: 1;
	}
`;

const slideOut = keyframes`
	0% {
		transform: translateY(0);
		opacity: 1;
	}
	100% {
		transform: translateY(100%);
		opacity: 0;
	}
`;

export const NotificationWrapper = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	z-index: 1000;
`;

export const NotificationContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 400px;
	padding: 16px;
	background-color: rgba(20, 20, 20, 0.9);
	color: rgba(255, 255, 255, 0.85);
	font-family: 'Orbitron', sans-serif;
	font-size: 16px;
	border-radius: 10px;
	border-left: 4px solid #6a0dad;
	box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease;
	animation: ${slideIn} 0.5s forwards;

	&.hide {
		animation: ${slideOut} 0.5s forwards;
	}

	h4 {
		margin: 0 0 8px;
		font-size: 18px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		letter-spacing: 1px;
	}

	p {
		margin: 0;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.8);
		font-family: 'Inter', sans-serif;
	}

	&.info {
		border-left-color: #6a0dad;
		background-color: rgba(20, 20, 20, 0.9);
	}

	&.success {
		border-left-color: #00ff88;
		background-color: rgba(20, 50, 20, 0.9);
	}

	&.error {
		border-left-color: #ff5555;
		background-color: rgba(50, 20, 20, 0.9);
	}

	&.warning {
		border-left-color: #ffaa00;
		background-color: rgba(50, 50, 20, 0.9);
	}

	&.crab {
		border-left-color: #0088ff;
		background-color: rgba(20, 20, 50, 0.9);
		flex-direction: row;
		align-items: center;

		.avatar {
			margin-right: 16px;

			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}
		}

		.message {
			flex: 1;
		}
	}
`;
