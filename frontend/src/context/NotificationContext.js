import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Notification from "../components/Notification/Notification";
import { useAuth } from "./AuthContext";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	const [sound] = useState(new Audio('/sounds/notification.mp3'));
	const { hasInteracted } = useAuth();
	const hasInteractedRef = useRef(hasInteracted);

	const addNotification = useCallback((type, message) => {
		const id = Date.now();

		sound.volume = 0.3;
		if (type === 'info' && hasInteractedRef.current) sound.play();
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
	}, [sound]);

	useEffect(() => {
		hasInteractedRef.current = hasInteracted;
	}, [hasInteracted]);

	return (
		<NotificationContext.Provider value={{ addNotification }}>
			{children}
			<Notification notifications={notifications}/>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
