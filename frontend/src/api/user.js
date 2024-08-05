import API from './api';

const GetUser = async () => {
	console.log('Getting user...');
	return await API.get('users/@me/profile');
};

export default GetUser;
