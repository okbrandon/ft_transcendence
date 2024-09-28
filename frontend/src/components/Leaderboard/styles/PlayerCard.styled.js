import styled, { keyframes } from 'styled-components';

const glowing = keyframes`
	0% {
		box-shadow: 0 0 10px 0px #7A1CAC;
	}
	50% {
		box-shadow: 0 0 20px 10px #7A1CAC;
	}
	100% {
		box-shadow: 0 0 10px 0px #7A1CAC;
	}
`;

export const PlayerCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 450px;
	height: 270px;
	border: 1px solid black;
	background: linear-gradient(180deg, #7A1CAC 0%, #2E073F	 100%);
	border-radius: 10px;
	margin-top: 50px;
	margin-right: 20px;
	transition: transform 0.3s;

	&:hover {
		transform: scale(1.05);

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 10px;
			background: linear-gradient(180deg, #7A1CAC 0%, #2E073F	 100%);
			z-index: -1;
			filter: blur(5px);
			animation: ${glowing} 2s linear infinite;
			opacity: .5;
			transition: opacity .3s ease-in-out;
		}
	}
`;

export const PlayerBannerContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const PlayerBannerImg = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 10px 10px 0 0;
`;

export const PlayerProfileContainer = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
`;

export const PlayerProfileImg = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	margin: -50px 0 0 20px;
`;

export const PlayerIDContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: flex-start;
	align-items: center;
	margin-top: 10px;
	padding-left: 20px;

	// on hover add 3 dots button to see more info like nb win, nb loss, nb draw, win rate
`;

export const PlayerName = styled.h2`
	font-size: 1.5rem;
`;

export const PlayerStatsContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: flex-end;
	padding-right: 40px;
`;
