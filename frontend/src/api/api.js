import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import refreshToken from './token';

export const isLoggedIn = () => {
	return !isTokenExpired() && !isRefreshExpired();
};

export const isTokenExpired = () => {
	const token = localStorage.getItem('token');

	if (token) {
		const decodedToken = jwtDecode(token);
	
		if (decodedToken.exp < Date.now() / 1000) {
			console.log('Token expired');
			return true;
		}
	}
	return false;
};

export const isRefreshExpired = () => {
	const refresh = localStorage.getItem('refresh');
	const decodedRefresh = jwtDecode(refresh);

	if (decodedRefresh.exp < Date.now() / 1000) {
		console.log('Refresh expired');
		return true;
	}
	return false;
};

const API = axios.create({
	baseURL: 'http://localhost:8000/api/v1/',
});

API.interceptors.request.use(
	async (config) => {
		try {
			const token = localStorage.getItem('token');
			if (token && isLoggedIn()) {
				console.log('FIRST');
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				console.log('SECOND');
				const newToken = await refreshToken();
				config.headers.Authorization = `Bearer ${newToken}`;
			}
			return config;
		} catch (error) {
			throw new Error(error);
		}
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default API;
