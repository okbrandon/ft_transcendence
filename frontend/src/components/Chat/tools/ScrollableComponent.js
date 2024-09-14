import React from 'react';

const ScrollableComponent = ({ children }) => {
	return (
		<div style={{ overflowY: 'scroll', height: '100%' }}>
			{children}
		</div>
	);
};

export default ScrollableComponent;
