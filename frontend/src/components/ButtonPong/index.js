import React from 'react';
import StyledButtonPong from '../styles/PongButton.styled';

const ButtonPong = ({ title, variant, onClick }) => {
	return (
		<StyledButtonPong variant={variant} onClick={onClick}>
			{title || 'Pong'}
		</StyledButtonPong>
	);
};

export default ButtonPong;
