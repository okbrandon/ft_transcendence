import React from 'react';
import StyledPongButton from '../../../styles/shared/button/PongButton.styled';
import { motion } from 'framer-motion';

const PongButton = ({ title, variant, onClick }) => {
	return (
		<motion.div
			whileHover={{ scale: [null, 1.10, 1.08] }}
			transition={{ duration: 0.3 }}>
			<StyledPongButton variant={variant} onClick={onClick}>
				{title || 'Pong'}
			</StyledPongButton>
		</motion.div>
	);
};

export default PongButton;
