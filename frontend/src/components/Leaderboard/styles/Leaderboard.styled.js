import styled from 'styled-components';

export const WrapContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 100px 50px 0 50px;
`;

export const HeaderContainer = styled.div`
	display: flex;
	justify-content: start;
`;

export const MainContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export const LeaderboardContainer = styled.div`
	width: 60%;
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
