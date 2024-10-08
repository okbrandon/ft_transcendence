import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { NotificationWrapper, NotificationContainer } from './styles/Notification.styled';

const Notification = forwardRef((_, ref) => {
	const [notifications, setNotifications] = useState([]);

	useImperativeHandle(ref, () => ({
		addNotification(type, message) {
			const id = Date.now();
			setNotifications(prev => [...prev, { id, type, message, isVisible: true }]);

			setTimeout(() => {
				setNotifications(prev =>
					prev.map(notification =>
						notification.id === id ? { ...notification, isVisible: false } : notification
					)
				);
			}, 4500);

			setTimeout(() => {
				setNotifications(prev => prev.filter(notification => notification.id !== id));
			}, 5000);
		}
	  }));

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
});

export default Notification;
