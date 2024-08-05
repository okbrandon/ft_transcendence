import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CheckToken = async () => {
	const navigate = useNavigate();

	useEffect(() => {
		const validateToken = async () => {
			try {
				const token = localStorage.getItem('token');
				const refreshToken = localStorage.getItem('refresh');

				if (!token || !refreshToken) {
					throw new Error('No token found.');
				}

				const response = await fetch('http://localhost:8000/api/v1/users/@me/profile', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + localStorage.getItem('token'),
					},
				});

				if (!response.ok) {
					console.log('Error: Token expired:', response.status);

					const refreshResponse = await fetch('http://localhost:8000/api/v1/auth/token/refresh', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ refresh: localStorage.getItem('refresh') }),
					});

					if (!refreshResponse.ok) {
						throw new Error('Refresh Failed.');
					} else {
						const data = await refreshResponse.json();

						localStorage.setItem('token', data.access);
						console.log('Refresh successful:', data);
					}
				}
			} catch (error) {
				console.log(error);
				navigate('/login');
			}
		};

		validateToken();
	}, [navigate]);
};

export default CheckToken;
