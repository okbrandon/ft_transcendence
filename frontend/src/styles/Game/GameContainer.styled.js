import styled from 'styled-components';

const GameContainer = styled.div`
	display: relative;
	position: absolute;
	margin-top: 7vh;
	border: 3px solid white;
	box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.5);
	width: 1000px;
	height: 600px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

export const GameSeparator = styled.div`
	position: absolute;
	height: 100%;
	left: 50%;
	transform: translateX(-50%);
	border: 2px dashed white;
`;

export default GameContainer;
