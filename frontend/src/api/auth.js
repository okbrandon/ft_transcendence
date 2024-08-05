import API from './api';

export const ApiLogin = async (username, password) => {
	const response = await API.post('auth/token', { username, password });
	localStorage.setItem('token', response.data.access);
	localStorage.setItem('refresh', response.data.refresh);
	console.log('Login successful');
};

export const ApiSignup = async (username, email, password) => {
	await API.post('auth/register', { username, email, password, lang: 'fr' });
	console.log('Signup successful');
};
