import React from 'react';
import StyledButtonPong from '../styles/ButtonPong.styled';

const ButtonPong = ({ title, variant, onClick }) => {
	return (
		<StyledButtonPong variant={variant} onClick={onClick}>
			{title || 'Pong'}
		</StyledButtonPong>
	);
};

export default ButtonPong;
