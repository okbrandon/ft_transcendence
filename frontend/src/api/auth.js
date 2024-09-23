import axios from 'axios';

export const ApiLogin = async (username, password) => {
	const response = await axios.post(`/api/v1/auth/login`, { username, password });
	localStorage.setItem('token', response.data.access);
	localStorage.setItem('refresh', response.data.refresh);
	console.log('Login successful');
};

export const ApiSignup = async (formData) => {
	await axios.post(`/api/v1/auth/register`, { ...formData, lang: 'en' });
	console.log('Signup successful');
};
