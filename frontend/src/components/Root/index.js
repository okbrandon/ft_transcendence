import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Chat from '../Chat/Chat';
import Footer from '../Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import RelationProvider from '../../context/RelationContext';
import ConnectedNavBar from '../Navigation/ConnectedNavigation';

const Root = () => {
	const location = useLocation();
	const { isLoggedIn } = useAuth();
	const [showPersistentUI, setShowPersistentUI] = useState(true);

	useEffect(() => {
		if (location.pathname.includes('/game')) {
			setShowPersistentUI(false);
		} else {
			setShowPersistentUI(true);
		}
	}, [location]);

	return (
		<>
			{isLoggedIn ? (
				<RelationProvider>
					{showPersistentUI && <ConnectedNavBar/>}
					<main>
						<Chat/>
						<Outlet/>
					</main>
					{showPersistentUI && <Footer/>}
				</RelationProvider>
			) : (
				<>
					{showPersistentUI && <NavBar/>}
					<main>
						<Outlet/>
					</main>
					{showPersistentUI && <Footer/>}
				</>
			)}
		</>
	);
};

export default Root;
