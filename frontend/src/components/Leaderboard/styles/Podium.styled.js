import styled from 'styled-components';

// Podium container holding the three podium places
export const PodiumContainer = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 400px;
	width: 100%;
	margin-top: 20px;
	gap: 15px;
	perspective: 1000px; /* Adds 3D perspective */
	margin-bottom: 50px;
`;

// Common styles for each podium step with 3D effect
export const PodiumStep = styled.div`
	width: 180px;
	text-align: center;
	border-radius: 15px;
	background-color: #1b1e29;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding: 15px;
	transition: all 0.3s ease;
	position: relative;

	/* Adding shadows for depth */
	box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3), 0px 4px 8px rgba(0, 0, 0, 0.1);
	transform-style: preserve-3d;

	/* Hover effect to enhance the 3D relief */
	&:hover {
		transform: translateY(-5px) translateZ(10px);
		box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
	}
`;

// First place - gold, tallest, with enhanced 3D shadow
export const FirstPlace = styled(PodiumStep)`
	height: 300px;
	order: 2;
	background-color: #ffdb4d;
	transform: translateZ(20px); /* Makes first place more prominent */
	box-shadow: 0px 15px 30px rgba(255, 223, 0, 0.5), 0px 8px 16px rgba(0, 0, 0, 0.2);
`;

// Second place - silver, with slight 3D effect
export const SecondPlace = styled(PodiumStep)`
	height: 250px;
	order: 1;
	background-color: #c0c0c0;
	transform: translateZ(10px); /* Slightly lower 3D elevation */
	box-shadow: 0px 12px 24px rgba(192, 192, 192, 0.4), 0px 6px 12px rgba(0, 0, 0, 0.1);
`;

// Third place - bronze, least prominent but still 3D
export const ThirdPlace = styled(PodiumStep)`
	height: 200px;
	order: 3;
	background-color: #cd7f32;
	transform: translateZ(5px); /* Smallest elevation for third place */
	box-shadow: 0px 10px 20px rgba(205, 127, 50, 0.4), 0px 5px 10px rgba(0, 0, 0, 0.1);
`;

// Player info section with 3D effect
export const PlayerInfo = styled.div`
	text-align: center;
	color: #fff;
	margin-top: 10px;
	transform: translateZ(5px); /* Moves the info slightly forward */
`;

// Avatar image for the player with a border for clarity
export const PlayerAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	margin-bottom: 10px;
	border: 3px solid #fff;
	transform: translateZ(10px); /* Elevates the avatar to enhance prominence */
`;

// Player name styling with 3D effect
export const PlayerName = styled.h3`
	margin: 0;
	font-size: 1.2em;
	color: #fff;
	transform: translateZ(5px); /* Moves the name slightly forward */
`;

// Player score styling
export const PlayerScore = styled.p`
	margin: 5px 0;
	font-size: 1em;
	color: #e0e0e0;
	font-weight: bold;
	transform: translateZ(5px); /* Moves the score slightly forward */
`;

// Player prize styling
export const PlayerPrize = styled.p`
	margin: 5px 0;
	font-size: 0.9em;
	color: #ffcc00;
	font-weight: bold;
	transform: translateZ(5px); /* Moves the prize slightly forward */
`;

// Podium position at the bottom of each podium with a 3D relief effect
export const PodiumPosition = styled.div`
	position: absolute;
	bottom: -25px;
	font-size: 1.5em;
	font-weight: bold;
	color: #fff;
	background-color: #2c2f3b;
	padding: 5px 10px;
	border-radius: 5px;
	transform: translateZ(5px); /* Moves the position label slightly forward */
	box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
`;
