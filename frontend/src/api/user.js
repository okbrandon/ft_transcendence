import API from './api';

export const GetUser = async () => {
	console.log('Getting current user...');
	return await API.get('users/@me/profile');
};

export const GetUserByUsername = async (username) => {
	console.log('Getting user by username...');
	return await API.get(`users/${username}/profile`);
};

export const GetUsers = async (input) => {
	console.log('Getting users via search bar...');
	return await API.get(`users/search?content=${encodeURIComponent(input)}`);
}
