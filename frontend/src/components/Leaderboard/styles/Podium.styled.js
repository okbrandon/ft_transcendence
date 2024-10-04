import styled from 'styled-components';

export const PodiumContainer = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 400px;
	width: 100%;
	margin-top: 60px;
	gap: 120px;
	perspective: 1000px;
`;

export const PodiumBase = styled.div`
	position: relative;
	width: 150px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-image:
		linear-gradient(
			to top,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 100%
		),
		url(${props => props.imgSrc || '/images/podium.png'});
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 10px;
	height: ${props => props.height || '200px'};
	width: ${props => props.width || '150px'};
`;

export const FirstPlace = styled(PodiumBase)`
	height: 320px;	/* Tallest podium */
	order: 2;
`;

export const SecondPlace = styled(PodiumBase)`
	height: 280px;
	order: 1;
`;

export const ThirdPlace = styled(PodiumBase)`
	height: 250px;
	order: 3;
`;

export const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	color: #fff;
	gap: 40px;
`;

export const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 25%;
	border: 3px solid #3f3f3f;
	margin-top: -170px;
	margin-bottom: 20px;
	box-shadow: 0 0 100px rgba(255, 255, 255, 0.7);
`;

export const PlayerName = styled.div`
	font-size: 1.2em;
	color: #fff;
`;

export const PlayerScore = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1em;
	color: #e0e0e0;
	font-weight: bold;
	margin-bottom: 100px;
`;

export const TrophyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Badge = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	width: 40px;
	height: 30px;
	margin-bottom: 35px
`;

export const FirstPosition = styled(Badge)`
	background-color: #ffd700;
`;

export const SecondPosition = styled(Badge)`
	background-color: #c0c0c0;
`;

export const ThirdPosition = styled(Badge)`
	background-color: #cd7f32;
`;
