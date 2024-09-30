import styled from 'styled-components';

export const WrapContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 100px 50px 0 50px;
`;

export const LeaderboardContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: rgba(5, 5, 5, 0.8);
	margin: 20px 0 0 70px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 20px;
	border-radius: 20px;
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1), 0 0 15px rgba(164, 69, 178, 0.3);
	position: relative;
`;

export const ButtonsFilterContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`;

export const TimeFrameContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 0 20px 20px 20px;
`;

export const BackgroundContainer = styled.div`
	display: flex;
	justify-content: center;
	background-color: #f0f0f0;
	background-color: rgb(255, 255, 255, 0.1);
	border-radius: 5px;
	padding: 5px 10px 5px 10px;
`;

export const TimeFrameButton = styled.button`
	padding: 10px 20px;
	margin: 0 5px;
	border: none;
	border-radius: 5px;
	background-color: ${props => props.$isActive ? 'rgb(255, 255, 255, 0.2)' : 'rgb(255, 255, 255, 0.1)'};
	color: #fff;
	cursor: pointer;
	transition: background-color 0.3s ease;
	font-size: 1rem;
	font-weight: 500;

	&:hover {
		background-color: ${props => props.$isActive ? 'rgb(255, 255, 255, 0.2)' : 'rgb(255, 255, 255, 0.1)'};
	}
`;
