import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { isValidToken } from '../../api/api';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://localhost:8888/ws/chat/?token=';

const Root = () => {
	useWebSocket(WS_URL + localStorage.getItem('token'), {
		onOpen: () => console.log(`WebSocket connection opened:`),
		onMessage: (message) => console.log(`WebSocket message received:`, message),
	});
	return (
		<>
			<NavBar/>
			<main>
				<Outlet/>
			</main>
			<Footer/>
		</>
	);
};

export default Root;
