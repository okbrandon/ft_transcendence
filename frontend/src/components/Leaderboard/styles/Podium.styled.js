import styled from 'styled-components';

export const PodiumContainer = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 400px;
	width: 100%;
	gap: 100px;
	perspective: 1000px;
`;

export const PodiumBase = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	background-image: url('/images/podium.webp');
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
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

const calculateTop = (height, offset) => `${height - offset}px`;

export const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	color: #fff;
	position: relative;
	top: ${({ $position }) =>
		$position === 'first' ? calculateTop(320, 400) :
		$position === 'second' ? calculateTop(280, 380) :
		calculateTop(270, 370)};
`;

export const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 25%;
	border: 3px solid #3f3f3f;
	box-shadow: 0 0 100px rgba(255, 255, 255, 0.7);
	position: relative;
	object-fit: cover;
	top: ${({ $position }) =>
		$position === 'first' ? calculateTop(320, 400) :
		$position === 'second' ? calculateTop(280, 380) :
		calculateTop(270, 370)};
`;

export const PlayerScore = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1em;
	color: #e0e0e0;
	position: relative;
	font-weight: bold;
	top: ${({ $position }) =>
		$position === 'first' ? calculateTop(320, 250) :
		$position === 'second' ? calculateTop(280, 210) :
		calculateTop(270, 200)};
`;

export const TrophyContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: ${({ $position }) =>
		$position === 'first' ? calculateTop(320, 295) :
		$position === 'second' ? calculateTop(280, 255) :
		calculateTop(270, 250)};
`;

export const Separator = styled.hr`
	width: 100%;
	border: 0.5px solid #ccc;
	margin: 10px 0;
	box-sizing: border-box;
	position: relative;
	top: ${({ $position }) =>
		$position === 'first' ? calculateTop(320, 250) :
		$position === 'second' ? calculateTop(280, 210) :
		calculateTop(270, 200)};
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
