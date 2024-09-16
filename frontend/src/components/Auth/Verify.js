import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');

		if (code) {
			axios.post(`http://localhost:8888/api/v1/verify`, { code })
				.then(response => {
					console.log('Verification successful:', response.data);
					window.location.href = '/';
				})
				.catch(error => {
					console.error('Verification failed:', error.response.data);
				});
		} else {
			console.error('Verification code not found in URL parameters');
		}
	}, [location]);

	return (
		<div>
			<h1>Please waiting for the verificationing</h1>
			<p>We're verificating your emailing...</p>
		</div>
	);
};

export default Verify;
