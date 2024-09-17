import API from "./api";
import { GetUserByUsername } from "./user";

export const GetRelationships = async () => {
	console.log('Getting relationships...');
	return await API.get('users/@me/relationships');
};

export const GetFriends = () => {
	console.log('Getting friends...');
	API.get('users/@me/relationships')
		.then(res => {
			console.log('Friends:', res.data);
			return res.data.filter(relation => relation.status === 1).map(friend => {
				GetUserByUsername(friend.userB)
					.then(res => ({
						...friend,
						displayName: res.data.displayName,
						avatarID: res.data.avatarID,
					}))
					.catch(err => {
						console.error(err);
					});
			})
		})
		.catch(err => {
			console.error(err);
		});
	return [];
};

export const GetRequests = () => {
	console.log('Getting friend requests...');
	API.get('users/@me/relationships')
		.then(res => {
			console.log('Requests:', res.data);
			return res.data.filter(relation => relation.status === 0).map(request => {
				GetUserByUsername(request.userA)
					.then(res => ({
						...request,
						displayName: res.data.displayName,
						avatarID: res.data.avatarID,
					}))
					.catch(err => {
						console.error(err);
					})
			})
		})
		.catch(err => {
			console.error(err);
		});
	return [];
}
