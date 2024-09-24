import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import Chat from '../Chat/Chat';
import RelationProvider from '../../context/RelationContext';

const Root = () => {
	const { isLoggedIn } = useContext(AuthContext);
	return (
		<>
			<NavBar/>
			<main>
				<Outlet/>
				{ isLoggedIn && (
					<RelationProvider>
						<Chat/>
					</RelationProvider>
				) }
			</main>
			<Footer/>
		</>
	);
};

export default Root;
