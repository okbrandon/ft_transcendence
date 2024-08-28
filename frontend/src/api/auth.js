import axios from 'axios';

export const ApiLogin = async (username, password) => {
	const response = await axios.post(`${window.location.origin}/api/v1/auth/login`, { username, password });
	localStorage.setItem('token', response.data.access);
	localStorage.setItem('refresh', response.data.refresh);
	console.log('Login successful');
};

export const ApiSignup = async (username, email, password) => {
	await axios.post(`${window.location.origin}/api/v1/auth/register`, { username, email, password, lang: 'fr' });
	console.log('Signup successful');
};
