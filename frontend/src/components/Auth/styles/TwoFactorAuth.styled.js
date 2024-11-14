import styled from "styled-components";

export const AvailablePlatformsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 20px;
	margin-bottom: 1.5rem;
`;

export const PlatformButton = styled.button`
	max-width: 70px;
	border: none;
	border-radius: 5px;
	background-color: rgba(164, 69, 178, 0.5);
	color: rgba(255, 255, 255, 0.6);
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: rgba(164, 69, 178, 0.7);
	}

	&:disabled {
		background-color: rgba(164, 69, 178, 0.3);
		cursor: not-allowed;
	}

	& > i {
		font-size: 1.5rem;
	}
`;
