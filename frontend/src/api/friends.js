import { GetOtherFromRelationship } from "../scripts/relation";
import API from "./api";
import logger from "./logger";
import { formatUserData } from "./user";

export const GetUserFromRelation = async (profileUsername) => {
	try {
		logger('Getting user from relation...');
		const res = await API.get('users/@me/relationships');

		const user = res.data.filter(relation => relation.sender.username === profileUsername || relation.target.username === profileUsername);
		if (!user.length) return [];
		return user;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};

export const GetFriends = async () => {
	try {
		logger('Getting friends...');
		const res = await API.get('users/@me/relationships');
		const userID = localStorage.getItem('userID');

		const friends = res.data
			.filter(relation => relation.status === 1)
			.map(relation => {
				relation.sender = formatUserData(relation.sender);
				relation.target = formatUserData(relation.target);
				const friend = GetOtherFromRelationship(relation, userID);
				return { ...friend, relationID: relation.relationshipID };
			});
		return friends;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};

export const GetActiveFriends = async () => {
	try {
		logger('Getting active friends...');
		const res = await API.get('users/@me/relationships');
		const userID = localStorage.getItem('userID');

		const friends = res.data
			.filter(relation => relation.status === 1)
			.map(relation => {
				relation.sender = formatUserData(relation.sender);
				relation.target = formatUserData(relation.target);
				const friend = GetOtherFromRelationship(relation, userID);
				return { ...friend, relationID: relation.relationshipID };
			})
			.filter(friend => !!friend.status.online);
		return friends;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};

export const GetRequests = async () => {
	try {
		logger ('Getting requests...');
		const res = await API.get('users/@me/relationships');
		const userID = localStorage.getItem('userID');

		const requests = res.data
			.filter(relation => relation.status === 0)
			.map(relation => {
				relation.sender = formatUserData(relation.sender);
				relation.target = formatUserData(relation.target);
				const request = GetOtherFromRelationship(relation, userID);
				return { ...request, relationID: relation.relationshipID };
			});
		return requests;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};

export const GetBlockedUsers = async () => {
	try {
		logger('Getting blocked users...');
		const res = await API.get('users/@me/relationships');
		const userID = localStorage.getItem('userID');

		const blockedUsers = res.data
			.filter(relation => relation.status === 2)
			.map(relation => {
				relation.sender = formatUserData(relation.sender);
				relation.target = formatUserData(relation.target);
				const blockedUser = GetOtherFromRelationship(relation, userID);
				return { ...blockedUser, relationID: relation.relationshipID };
			})
			return blockedUsers;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};
