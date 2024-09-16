import React from 'react';
import MinimizeArrow, { MinimizeArrowContainer } from '../styles/global/MinimizeArrow.styled';

export const Arrow = ({ ArrowAnimate }) => {
	return (
		<MinimizeArrowContainer>
			<MinimizeArrow className={ArrowAnimate ? 'active' : ''}>
				<span></span>
				<span></span>
			</MinimizeArrow>
		</MinimizeArrowContainer>
	);
};
