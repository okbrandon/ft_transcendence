import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Callback = () => {
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');
		const refresh = params.get('refresh');

		if (token && refresh) {
			localStorage.setItem('token', token);
			localStorage.setItem('refresh', refresh);
			window.location.href = '/';
		} else {
			console.error('Token or refresh token not found in URL parameters');
		}
	}, [location]);

	return (
		<div>
			<h1>Callback Page</h1>
			<p>Processing your login...</p>
		</div>
	);
};

export default Callback;
