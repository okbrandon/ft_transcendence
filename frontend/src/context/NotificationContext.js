import React, { createContext, useCallback, useContext, useState } from "react";
import Notification from "../components/Notification/Notification";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	const addNotification = useCallback((type, message) => {
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
	}, []);

	return (
		<NotificationContext.Provider value={{ addNotification }}>
			{children}
			<Notification notifications={notifications}/>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
