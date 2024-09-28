import styled from 'styled-components';

const PongPaddle = styled.div.attrs(({ $side, $leftPaddleTop, $rightPaddleTop, $skin }) => ({
	style: {
		position: 'absolute',
		left: $side === 'left' ? '5px' : 'auto',
		right: $side === 'left' ? 'auto' : '5px',
		top: $side === 'left' ? `${$leftPaddleTop}px` : `${$rightPaddleTop}px`,
		width: '13px',
		height: '100px',
		background: $skin ? `url(${$skin})` : '#fff',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		borderRadius: '5px',
	},
}))``;

export default PongPaddle;
