import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Lines, Line } from "../../styles/animations/Lines.styled";
import Navigation from "../../features/Navigation/Navigation";
import FriendsList from "../../features/Friends/FriendsList";

const RootHome = () => {
	const [showFriends, setShowFriends] = useState(false);

	const handleFriends = () => {
		setShowFriends(!showFriends);
	};

	return (
		<>
			<Lines>
				<Line/>
				<Line/>
				<Line/>
			</Lines>
			<Navigation handleFriends={handleFriends}/>
			<FriendsList showFriends={showFriends} handleFriends={handleFriends}/>
			<Outlet/>
		</>
	);
};

export default RootHome;
