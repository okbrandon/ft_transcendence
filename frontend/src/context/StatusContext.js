import React, { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const WS_URL = 'ws://localhost:8888/ws/status/?token=';

export const StatusContext = createContext({
	status: null,
});


const setActivity = (location) => {
	if (location === '/vs-ai' || location === '/vs-player') {
		return 'QUEUEING';
	} else if (location === 'solo-vs-ai') {
		return 'PLAYING_VS_AI';
	}
	return 'HOME';
};

const StatusProvider = ({ children }) => {
	const [status, setStatus] = useState(null);
	const location = useLocation();
	const socket = useRef(null);

	useEffect(() => {
		socket.current = new WebSocket(WS_URL + localStorage.getItem('token'));
		socket.current.onopen = () => {
			console.log('WebSocket connection opened');
		};
		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data.type === 'heartbeat') {
				socket.current.send(JSON.stringify({ type: 'heartbeat', activity: setActivity(location) }));
			}
		};

		return () => {
			socket.current.close();
		};
	}, []);

	return (
		<StatusContext.Provider value={{ status }}>
			{ children }
		</StatusContext.Provider>
	);
};
