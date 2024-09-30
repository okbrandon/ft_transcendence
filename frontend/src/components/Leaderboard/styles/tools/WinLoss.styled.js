import styled from 'styled-components';

export const WinLossContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin: 0 20px 5px 0;
`;

export const ToggleButton = styled.button`
	position: relative;
	padding: 10px 20px;
	font-size: 16px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	overflow: hidden;
	transition: background-color 0.3s ease;
	background-color: ${props => props.$isWin ? '#4CAF50' : '#f44336'};
	color: white;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.2);
		transition: left 0.3s ease;
	}

	&:hover::before {
		left: 100%;
	}

	&:active span {
		transform: scale(0.95);
	}
`;

export const ButtonText = styled.span`
	position: relative;
	z-index: 1;
	transition: transform 0.3s ease;
`;
