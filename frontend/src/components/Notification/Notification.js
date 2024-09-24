import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { NotificationWrapper, NotificationContainer } from './styles/Notification.styled';

const Notification = forwardRef((_, ref) => {
	const [notifications, setNotifications] = useState([]);

	useImperativeHandle(ref, () => ({
		addNotification(type, message) {
			const id = Date.now(); // Unique ID for each notification
			setNotifications((prev) => [...prev, { id, type, message, isVisible: true }]);

			// After 4.5 seconds, start hiding the notification (so slideOut animation plays)
			setTimeout(() => {
				setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === id ? { ...notification, isVisible: false } : notification
				)
				);
			}, 4500);

			// After 5 seconds, remove the notification from the DOM
			setTimeout(() => {
				setNotifications((prev) => prev.filter((notification) => notification.id !== id));
			}, 5000);
		}
	  }));

	return (
		<NotificationWrapper>
		{notifications.map((notification) => (
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
