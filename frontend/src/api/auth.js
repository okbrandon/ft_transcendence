import axios from 'axios';

export const apiLogin = async (username, password, otp) => {
	const data = otp ? { username, password, otp } : { username, password };
	const response = await axios.post(process.env.REACT_APP_ENV === 'production' ? '/api/v1/auth/login' : 'http://localhost:8000/api/v1/auth/login', data);
	localStorage.setItem('token', response.data.access);
	localStorage.setItem('refresh', response.data.refresh);
};

export const apiSignup = async formData => {
	await axios.post(process.env.REACT_APP_ENV === 'production' ? '/api/v1/auth/register' : 'http://localhost:8000/api/v1/auth/register', formData);
};
