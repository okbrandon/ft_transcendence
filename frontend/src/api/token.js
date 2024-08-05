import API from "./api";
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
	const refresh = localStorage.getItem("refresh");

	if (!refresh) {
		throw new Error("No refresh token found");
	}

	const decoded = jwtDecode(refresh);
	
	if (decoded.exp < Date.now() / 1000) {
		throw new Error("Refresh token expired");
	}

	const response = await API.post("auth/token/refresh/", { refresh });
	const newToken = response.data.access;

	localStorage.setItem("token", newToken);
	return newToken;
};

export default refreshToken;
