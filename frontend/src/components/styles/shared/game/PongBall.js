import styled from 'styled-components';

const PongBall = styled.div`
	position: absolute;
	width: 25px;
	height: 25px;
	${({ x, y }) => `left: ${x}px; top: ${y}px;`};
	left: 485px;
	top: 285px;
	border-radius: 50%;
	background-color: #fff;
`;

export default PongBall;
