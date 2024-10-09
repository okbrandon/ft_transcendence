import React from 'react';
import { NotificationWrapper, NotificationContainer } from './styles/Notification.styled';

const Notification = ({ notifications }) => {
	return (
		<NotificationWrapper>
			{notifications.map(notification => (
				<NotificationContainer
					key={notification.id}
					className={`${notification.type} ${notification.isVisible ? '' : 'hide'}`}
				>
				<h4>{notification.type.toUpperCase()}</h4>
				<p>{notification.message}</p>
				</NotificationContainer>
			))}
		</NotificationWrapper>
	);
};

export default Notification;
