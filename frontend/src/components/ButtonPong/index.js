import React from 'react';
import StyledButtonPong from '../styles/ButtonPong.styled';

const ButtonPong = ({ title }) => {
	return (
		<StyledButtonPong variant="light">
			{title || 'Pong'}
		</StyledButtonPong>
	);
}

export default ButtonPong;