import API from "./api";
import logger from "./logger";
import { GetUserByUsername } from "./user";

export const GetRelationships = async () => {
	logger('Getting relationships...');

	return await API.get('users/@me/relationships');
};

export const GetFriends = async ({ userID }) => {
	logger('Getting friends...');

	try {
		const res = await API.get('users/@me/relationships');
		const friends = await Promise.all(
			res.data
				.filter(relation => relation.status === 1)
				.map(async friend => {
					try {
						const userRes = await GetUserByUsername(friend.userA === userID ? friend.userB : friend.userA);
						return {
							...friend,
							displayName: userRes.data.displayName ? userRes.data.displayName : userRes.data.username,
							username: userRes.data.username,
							avatarID: userRes.data.avatarID,
						};
					} catch (error) {
						console.error("Error fetching friend details: ", error);
						return friend;
					}
				})
		);
		return friends;
	} catch (error) {
		console.error("Error fetching friends: ", error);
		return [];
	}
};

export const GetRequests = async () => {
	logger('Getting requests...');
	const userID = localStorage.getItem('userID');

	try {
		const res = await API.get('users/@me/relationships');
		const requests = await Promise.all(
			res.data
				.filter(relation => relation.status === 0)
				.map(async request => {
					try {
						const userRes = await GetUserByUsername(request.userA === userID ? request.userB : request.userA);
						return {
							...request,
							displayName: userRes.data.displayName ? userRes.data.displayName : userRes.data.username,
							avatarID: userRes.data.avatarID,
						};
					} catch (error) {
						console.error("Error fetching request details: ", error);
						return request;
					}
				})
		);
		return requests;
	} catch (error) {
		console.error("Error fetching requests: ", error);
		return [];
	}
};
