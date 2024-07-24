import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Lines, Line } from "../../styles/animations/Lines.styled";
import Navigation from "../../features/Navigation/Navigation";
import Friends from "../../features/Friends/Friends";

const RootHome = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login');
		}
		fetch('http://localhost:8000/api/v1/users/@me/profile', {
			method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
				},
		}).then((response) => {
			if (response.status != 200) {
				navigate('/login');
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	}, []);
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
			<Friends showFriends={showFriends} handleFriends={handleFriends}/>
			<Outlet/>
		</>
	);
};

export default RootHome;
