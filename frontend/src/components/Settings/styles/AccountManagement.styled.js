import styled from 'styled-components';

export const AccountManagementContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-bottom: 3rem;
	gap: 5px;
`;

export const AccountManagementButton = styled.button`
	padding: 1rem 2rem;
	border: 2px solid rgba(255, 50, 50, 0.4);
	border-radius: 15px;
	background-color: rgba(255, 50, 50, 0.7);
	color: #fff;
	font-family: 'Orbitron', sans-serif;
	font-size: 1.1rem;
	letter-spacing: 1px;
	text-transform: uppercase;
	transition: all 0.3s ease;
	cursor: pointer;

	&:hover {
		background-color: rgba(255, 50, 50, 0.9);
		box-shadow: 0 0 20px rgba(255, 50, 50, 0.8);
		transform: translateY(-3px);
	}

	&:active {
		transform: translateY(1px);
		background-color: rgba(255, 50, 50, 0.9);
	}
`;

export const AccountManagementText = styled.p`
	color: rgba(255, 255, 255, 0.7);
	font-family: 'Poppins', sans-serif;
	font-size: 1rem;
	text-align: center;
	margin-top: 0.5rem;
`;

export const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ModalContainer = styled.div`
	background-color: #fff;
	padding: 2rem;
	border-radius: 10px;
	width: 400px;
	max-width: 90%;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	text-align: center;
`;

export const ModalContent = styled.div`
	p {
		font-family: 'Poppins', sans-serif;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		color: #333;
	}
	div {
		display: flex;
		justify-content: space-around;
	}
`;

export const ModalButton = styled.button`
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 5px;
	font-family: 'Poppins', sans-serif;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.2s ease;

	&:first-child {
		background-color: rgba(255, 50, 50, 0.8);
		color: white;
	}

	&:first-child:hover {
		background-color: rgba(255, 50, 50, 1);
	}

	&:last-child {
		background-color: #ccc;
		color: #333;
	}

	&:last-child:hover {
		background-color: #bbb;
	}
`;
