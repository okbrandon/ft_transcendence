import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	background-color: rgba(255, 0, 0, 0.9);
	color: white;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	z-index: 1000;
`;

const NotificationBadge = ({ count }) => {
	return (
		<BadgeContainer>
			{count}
		</BadgeContainer>
	);
};

export default NotificationBadge;
