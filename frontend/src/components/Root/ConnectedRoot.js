import React, { useContext, useEffect, useRef } from "react";
import Chat from "../Chat/Chat";
import Notification from "../Notification/Notification";
import { RelationContext } from "../../context/RelationContext";

const ConnectedRoot = () => {
	const notificationRef = useRef(null);
	const { notificationUser, setNotificationUser } = useContext(RelationContext);

	useEffect(() => {
		if (notificationUser) {
			if (notificationUser.status === 'pending') {
				notificationRef.current.addNotification(
					`info`,
					`You have a friend request from ${notificationUser.displayName}.`
				);
			} else if (notificationUser.status === 'rejected') {
				notificationRef.current.addNotification(
					`info`,
					`${notificationUser.displayName} rejected your friend request.`
				);
			} else if (notificationUser.status === 'accepted') {
				notificationRef.current.addNotification(
					`info`,
					`${notificationUser.displayName} accepted your friend request.`
				);
			}
			setNotificationUser(null);
		}
	}, [notificationUser, setNotificationUser]);

	return (
		<>
			<Chat/>
			<Notification ref={notificationRef}/>
		</>
	);

};

export default ConnectedRoot;
