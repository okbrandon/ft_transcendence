import axios from "axios";

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = newToken => {
	refreshSubscribers.forEach(callback => callback(newToken));
	refreshSubscribers = [];
};

const addRefreshSubscriber = callback => {
	refreshSubscribers.push(callback);
};

const refreshToken = async () => {
	const refresh = localStorage.getItem("refresh");

	if (!refresh) {
		return null;
	}

	try {
		if (isRefreshing) {
			return new Promise(resolve => {
				addRefreshSubscriber(resolve);
			});
		}

		isRefreshing = true;

		const response = await axios.post(
			process.env.REACT_APP_ENV === "production"
			? "/api/v1/auth/token/refresh"
			: "http://localhost:8000/api/v1/auth/token/refresh",
			{ refresh }
		);

		const newToken = response.data.access;
		localStorage.setItem("token", newToken);

		isRefreshing = false;
		onRefreshed(newToken);

		return newToken;
	} catch (error) {
		localStorage.clear();
		window.location.href = "/signin";
		throw error;
	} finally {
		isRefreshing = false;
	}
};

export default refreshToken;
