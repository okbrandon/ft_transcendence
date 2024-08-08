import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

const Root = () => {
	return (
		<>
			<NavBar/>
			<Outlet/>
			<Footer/>
		</>
	);
};

export default Root;
