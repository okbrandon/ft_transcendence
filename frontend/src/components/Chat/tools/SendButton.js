import styled from 'styled-components';

export const SendButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	padding: 0 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #0084ff;
	transition: color 0.3s ease;

	&:hover {
		color: #0056b3;
	}

	&:disabled {
		color: #ccc;
		cursor: not-allowed;
	}
`;
