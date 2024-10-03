import styled from 'styled-components';

export const PodiumContainer = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 400px;
	width: 100%;
	margin-top: 20px;
	gap: 120px;
	perspective: 1000px;
	margin-bottom: 50px;
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
	transform-style: preserve-3d;
	height: ${props => props.height || '200px'};
	width: ${props => props.width || '150px'};
`;

export const FirstPlace = styled(PodiumBase)`
	height: 330px;	/* Tallest podium */
	order: 2;
`;

// Second place
export const SecondPlace = styled(PodiumBase)`
	height: 290px;	/* Slightly shorter than the first */
	order: 1;
`;

// Third place
export const ThirdPlace = styled(PodiumBase)`
	height: 280px;	/* Shortest podium */
	order: 3;
`;

export const PlayerInfo = styled.div`
	text-align: center;
	color: #fff;
	margin-top: 10px;
	transform: translateZ(5px); /* Moves the info slightly forward */
`;

export const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	margin-bottom: 10px;
	border: 3px solid #fff;
	transform: translateZ(10px); /* Elevates the avatar to enhance prominence */
`;

export const PlayerName = styled.h3`
	margin: 0;
	font-size: 1.2em;
	color: #fff;
	transform: translateZ(5px); /* Moves the name slightly forward */
`;

export const PlayerScore = styled.p`
	margin: 5px 0;
	font-size: 1em;
	color: #e0e0e0;
	font-weight: bold;
	transform: translateZ(5px); /* Moves the score slightly forward */
`;

export const PlayerPrize = styled.p`
	margin: 5px 0;
	font-size: 0.9em;
	color: #ffcc00;
	font-weight: bold;
	transform: translateZ(5px); /* Moves the prize slightly forward */
`;

export const PodiumPosition = styled.div`
	position: absolute;
	bottom: -25px;
	font-size: 1.5em;
	font-weight: bold;
	color: #fff;
	background-color: #ffcc00;
	padding: 5px 10px;
	border-radius: 5px;
	transform: translateZ(5px); /* Moves the position label slightly forward */
	box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
`;
