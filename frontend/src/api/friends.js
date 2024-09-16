import API from "./api";

export const GetFriends = async () => {
	console.log('Getting friends...');
	return await API.get('users/@me/relationships');
};
