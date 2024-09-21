import styled from "styled-components";

const PongButton = styled.button`
	padding: 1rem 2rem;
	width: ${({ $width }) => $width || 'auto'};
	border: none;
	border-radius: 5px;
	background-color: ${({ $backgroundColor }) => $backgroundColor || 'rgba(164, 69, 178, 0.7)'};
	color: #fff;
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		background-color: rgba(164, 69, 178, 0.9);
		box-shadow: 0 0 15px rgba(164, 69, 178, 0.7);
	}

	&:disabled {
		background-color: rgba(164, 69, 178, 0.5);
		cursor: not-allowed;
		pointer-events: none;
	}
`;

export default PongButton;
