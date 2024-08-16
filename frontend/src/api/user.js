import API from './api';

export const GetUser = async () => {
	console.log('Getting user...');
	return await API.get('users/@me/profile');
};

export const GetUsers = async () => {
	console.log('Getting users...');
	return await API.get('users');
}
