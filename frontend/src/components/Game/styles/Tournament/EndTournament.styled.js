import styled from 'styled-components';
import { BackgroundContainer } from '../../../Leaderboard/styles/Leaderboard.styled';

export const EndTournamentContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	padding: 20px;
	padding-top: 100px;

	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);

	font-family: 'Orbitron', sans-serif;
`;

export const HeaderTournamentContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

export const TournamentHeadDetails = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin: 20px;
`;

export const TournamentTitle = styled.h1`
	font-size: 2em;
	margin: 0;
`;

export const ParticipantsDetails = styled.div`
	display: flex;
	align-items: center;
	color: rgba(128, 128, 128, 0.5);
`;

export const TournamentNavigation = styled.div`
	padding: 10px 0;
	display: flex;
	justify-content: center;
`;

export const BackgroundTournamentContainer = styled.div`
	display: flex;
	justify-content: center;
	background-color: rgb(255, 255, 255, 0.1);
	border-radius: 5px;
	padding: 10px;
`;

export const NavButtons = styled.button`
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

export const BottomContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
`;
