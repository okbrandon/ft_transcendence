import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import Chat from '../Chat/Chat';
import ChatProvider from '../../context/ChatContext';

const Root = () => {
	const { isLoggedIn } = useContext(AuthContext);
	return (
		<>
			<NavBar/>
			<main>
				<Outlet/>
				{ isLoggedIn && (
					<ChatProvider>
						<Chat/>
					</ChatProvider>
				) }
			</main>
			<Footer/>
		</>
	);
};

export default Root;
