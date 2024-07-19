import React from 'react';
import StyledPongButton from '../../styles/shared/button/PongButton.styled';

const PongButton = ({ title, variant, onClick }) => {
	return (
		<StyledPongButton variant={variant} onClick={onClick}>
			{title || 'Pong'}
		</StyledPongButton>
	);
};

export default PongButton;
