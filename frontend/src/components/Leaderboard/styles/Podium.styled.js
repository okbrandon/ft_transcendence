import styled from 'styled-components';

export const PodiumContainer = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 400px;
	width: 100%;
	margin-top: 60px;
	gap: 100px;
	perspective: 1000px;
`;

export const PodiumBase = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	background-image:
		linear-gradient(
			to top,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 0) 100%
		),
		url('/images/podium.png');
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 10px;
	width: 200px;

	&.first {
		height: 320px;
	}

	&.second {
		height: 280px;
	}

	&.third {
		height: 270px;
	}

`;

export const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	color: #fff;
`;

export const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 25%;
	border: 3px solid #3f3f3f;
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
`;

export const TrophyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 15px;
`;

export const Separator = styled.hr`
	width: 100%;
	border: 0.5px solid #ccc;
	margin: 10px 0;
	box-sizing: border-box;
`;

export const Badge = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	width: 40px;
	height: 30px;

	&.first {
		background-color: #ffd700;
	}

	&.second {
		background-color: #c0c0c0;
	}

	&.third {
		background-color: #cd7f32;
	}
`;
