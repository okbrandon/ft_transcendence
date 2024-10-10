import { jwtDecode } from "jwt-decode";
import axios from "axios";

const refreshToken = async () => {
	const refresh = localStorage.getItem("refresh");

	if (!refresh) {
		throw new Error("No refresh token found");
	}

	const decoded = jwtDecode(refresh);

	if (decoded.exp < Date.now() / 1000) {
		throw new Error("Refresh token expired");
	}

	const response = await axios.post(process.env.REACT_APP_ENV == 'production' ? '/api/v1/auth/token/refresh' : 'http://localhost:8000/api/v1/auth/token/refresh', { refresh });
	const newToken = response.data.access;

	localStorage.setItem("token", newToken);
	return newToken;
};

export default refreshToken;
