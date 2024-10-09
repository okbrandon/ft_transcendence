import axios from 'axios';

export const ApiLogin = async (username, password, otp) => {
	const data = otp ? { username, password, otp } : { username, password };
	const response = await axios.post('/api/v1/auth/login', data);
	localStorage.setItem('token', response.data.access);
	localStorage.setItem('refresh', response.data.refresh);
};

export const ApiSignup = async formData => {
	await axios.post('/api/v1/auth/register', formData);
};
