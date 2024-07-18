import React from "react";
import { Outlet } from "react-router-dom";
import { Lines, Line } from "../../styles/animations/Lines.styled";
import Navigation from "../NavBar";

const RootMenu = () => {
	return (
		<>
			<Lines>
				<Line/>
				<Line/>
				<Line/>
			</Lines>
			<Navigation/>
			<Outlet/>
		</>
	);
};

export default RootMenu;
