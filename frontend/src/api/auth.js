import { useNavigate } from "react-router-dom";

export const ApiLogin = async (username, password) => {
	try {
		const navigate = useNavigate();
		const response = await fetch('http://localhost:8000/api/v1/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		if (!response.ok) {
			throw new Error('Login Failed.');
		}

		const data = await response.json();

		localStorage.setItem('token', data.access);
		localStorage.setItem('refresh', data.refresh);
		console.log('Login successful:', data);
		navigate('/home');
	} catch (error) {
		console.error(error);
		alert('Login Failed.');
	}
};

export const ApiSignup = async (username, email, password) => {
	try {
		const navigate = useNavigate();
		const response = await fetch('http://localhost:8000/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, email, password, lang: 'fr' }),
		});

		if (!response.ok) {
			throw new Error('Signup Failed.');
		}

		console.log('Signup successful:', response.status);
		navigate('/login');
	} catch (error) {
		console.error(error);
		alert('Signup Failed.');
	}
};

export const Logout = () => {
	const navigate = useNavigate();

	localStorage.removeItem('token');
	localStorage.removeItem('refresh');
	navigate('/');
};
