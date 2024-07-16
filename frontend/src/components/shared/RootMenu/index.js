import React from "react";
import { Outlet } from "react-router-dom";
import { Lines, Line } from "../../styles/layouts/Lines.styled";

const RootMenu = () => {
	return (
		<>
			<Lines>
				<Line/>
				<Line/>
				<Line/>
			</Lines>
			<Outlet/>
		</>
	);
};

export default RootMenu;
