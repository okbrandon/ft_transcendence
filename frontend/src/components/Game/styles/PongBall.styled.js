import styled from 'styled-components';

const PongBall = styled.div.attrs(({ x, y }) => ({
	style: {
		position: 'absolute',
		width: '25px',
		height: '25px',
		left: `${x}px`,
		top: `${y}px`,
		borderRadius: '50%',
		backgroundColor: '#fff',
	},
}))``;

export default PongBall;
