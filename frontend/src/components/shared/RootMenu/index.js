import React from "react";
import { Outlet } from "react-router-dom";
import { Lines, Line } from "../../styles/animations/Lines.styled";
import NavBar from "../NavBar";

const RootMenu = () => {
	return (
		<>
			<Lines>
				<Line/>
				<Line/>
				<Line/>
			</Lines>
			<NavBar/>
			<Outlet/>
		</>
	);
};

export default RootMenu;
