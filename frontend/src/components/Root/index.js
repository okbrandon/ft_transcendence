import React from 'react';
import Background from '../styles/Background.styled';
import { Outlet } from 'react-router-dom';

const Root = () => {
	return (
		<Background>
			<Outlet/>
		</Background>
	);
};

export default Root;