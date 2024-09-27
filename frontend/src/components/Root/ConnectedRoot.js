import React, { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Chat from "../Chat/Chat";
import Notification from "../Notification/Notification";
import { RelationContext } from "../../context/RelationContext";

const ConnectedRoot = () => {
	const notificationRef = useRef(null);
	const { requestUser, setRequestUser } = useContext(RelationContext);

	useEffect(() => {
		if (requestUser) {
			if (requestUser.status === 'pending') {
				notificationRef.current.addNotification(
					`info`,
					`You have a friend request from ${requestUser.displayName}.`
				);
			} else if (requestUser.status === 'rejected') {
				notificationRef.current.addNotification(
					`info`,
					`${requestUser.displayName} rejected your friend request.`
				);
			}
			setRequestUser(null);
		}
	}, [requestUser, setRequestUser]);

	return (
		<>
			<Chat/>
			<Notification ref={notificationRef}/>
			<Outlet/>
		</>
	);

};

export default ConnectedRoot;
