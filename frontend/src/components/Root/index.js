import React from 'react';
import { Outlet } from 'react-router-dom';
import { PongBar, PongBall } from '../styles/PongBackground.styled';

const Root = () => {
	return (
		<>
			<PongBar/>
			<PongBall/>
			<Outlet/>
		</>
	);
};

export default Root;
