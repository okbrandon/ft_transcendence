import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Lines, Line } from "../../styles/animations/Lines.styled";
import Navigation from "../../features/Navigation/Navigation";
import Friends from "../../features/Friends/Friends";
import checkToken from "../../../api/token/checkToken";
import refreshToken from "../../../api/token/refreshToken";

const RootHome = () => {
	const navigate = useNavigate();
	const [showFriends, setShowFriends] = useState(false);

	useEffect(() => {
		checkToken().catch(() => refreshToken().catch(() => navigate('/login')));
	}, [navigate]);

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
			<Friends showFriends={showFriends} handleFriends={handleFriends}/>
			<Outlet/>
		</>
	);
};

export default RootHome;
