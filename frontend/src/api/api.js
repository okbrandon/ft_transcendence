import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import refreshToken from './token';
import logger from './logger';

export const isValidToken = () => {
	return !isTokenExpired() || !isRefreshExpired();
};

export const isTokenExpired = () => {
	const token = localStorage.getItem('token');

	if (token) {
		const decodedToken = jwtDecode(token);

		if (decodedToken.exp < Date.now() / 1000) {
			logger('INFO: Token expired');
			return true;
		}
	} else {
		logger('INFO: No token found');
		return true;
	}
	logger('INFO: Token is valid');
	return false;
};

export const isRefreshExpired = () => {
	const refresh = localStorage.getItem('refresh');

	if (refresh) {
		const decodedRefresh = jwtDecode(refresh);

		if (decodedRefresh.exp < Date.now() / 1000) {
			logger('INFO: Refresh expired');
			return true;
		}
	} else {
		logger('INFO: No refresh found');
		return true;
	}
	logger('INFO: Refresh is valid');
	return false;
};

const API = axios.create({
	baseURL: `/api/v1/`,
});

API.interceptors.request.use(
	async (config) => {
		try {
			const token = localStorage.getItem('token');
			if (token && !isTokenExpired()) {
				logger('interceptor: Token is valid');
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				logger('interceptor: Refreshing token');
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
