import styled from 'styled-components';

const PongPaddle = styled.div`
	position: absolute;
	${({ side }) => side === 'left' ? `left: 5px;` : `right: 5px;`}
	${({ side, leftBarTop, rightBarTop }) => side === 'left' ? `top: ${leftBarTop}px;` : `top: ${rightBarTop}px`};
	width: 13px;
	height: 100px;
	background-color: white;
	border-radius: 5px;
`;

export default PongPaddle;
