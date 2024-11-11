import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import refreshToken from './token';

export const isValidToken = () => {
	return !isTokenExpired() || !isRefreshExpired();
};

export const isTokenExpired = () => {
	const token = localStorage.getItem('token');

	if (token) {
		const decodedToken = jwtDecode(token);

		if (decodedToken.exp < Date.now() / 1000) {
			return true;
		}
	} else {
		return true;
	}
	return false;
};

export const isRefreshExpired = () => {
	const refresh = localStorage.getItem('refresh');

	if (refresh) {
		const decodedRefresh = jwtDecode(refresh);

		if (decodedRefresh.exp < Date.now() / 1000) {
			return true;
		}
	} else {
		return true;
	}
	return false;
};

const API = axios.create({
	baseURL: process.env.REACT_APP_ENV === 'production' ? '/api/v1' : 'http://localhost:8000/api/v1',
});

API.interceptors.request.use(
	async (config) => {
		try {
			let token = localStorage.getItem('token');
			if (token && !isTokenExpired()) {
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				token = await refreshToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				} else {
					localStorage.clear();
					window.location.href = '/signin';
				}
			}
			return config;
		} catch (error) {
			localStorage.clear();
			window.location.href = '/signin';
			return Promise.reject(error);
		}
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default API;
