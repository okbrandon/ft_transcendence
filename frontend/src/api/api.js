import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import refreshToken from './token';

export const isLoggedIn = () => {
	return !isTokenExpired() || !isRefreshExpired();
};

export const isTokenExpired = () => {
	const token = localStorage.getItem('token');

	if (token) {
		const decodedToken = jwtDecode(token);
	
		if (decodedToken.exp < Date.now() / 1000) {
			console.log('INFO: Token expired');
			return true;
		}
	} else {
		console.log('INFO: No token found');
		return true;
	}
	console.log('INFO: Token is valid');
	return false;
};

export const isRefreshExpired = () => {
	const refresh = localStorage.getItem('refresh');

	if (refresh) {
		const decodedRefresh = jwtDecode(refresh);
	
		if (decodedRefresh.exp < Date.now() / 1000) {
			console.log('INFO: Refresh expired');
			return true;
		}
	} else {
		console.log('INFO: No refresh found');
		return true;
	}
	console.log('INFO: Refresh is valid');
	return false;
};

const API = axios.create({
	baseURL: 'http://localhost:8000/api/v1/',
});

API.interceptors.request.use(
	async (config) => {
		try {
			const token = localStorage.getItem('token');
			if (token && !isTokenExpired()) {
				console.log('interceptor: Token is valid');
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				console.log('interceptor: Refreshing token');
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
