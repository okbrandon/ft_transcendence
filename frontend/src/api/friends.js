import API from "./api";
import logger from "./logger";

export const GetRelationships = async () => {
	try {
		logger('Getting relationships...');
		const res = await API.get('users/@me/relationships');

		const relationships = res.data.map(relation => {
			if (relation.user.displayName === null) {
				relation.user.displayName = relation.user.username;
			}
			if (relation.user.avatarID === 'default' || relation.user.avatarID === null) {
				relation.user.avatarID = '/images/default-profile.png';
			}
			if (relation.user.bannerID === null) {
				relation.user.bannerID = '/images/default-banner.png';
			}
			return relation;
		});

		return relationships;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};

export const GetFriends = async () => {
	try {
		logger('Getting friends...');
		const res = await API.get('users/@me/relationships');

		const relationships = res.data
			.filter(relation => relation.status === 1)
			.map(relation => {
				if (relation.user.displayName === null) {
					relation.user.displayName = relation.user.username;
				}
				if (relation.user.avatarID === 'default' || relation.user.avatarID === null) {
					relation.user.avatarID = '/images/default-profile.png';
				}
				if (relation.user.bannerID === null) {
					relation.user.bannerID = '/images/default-banner.png';
				}
				return relation;
			});
		return relationships;
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

		const relationships = res.data
			.filter(relation => relation.status === 0 && relation.user.userID !== userID)
			.map(relation => {
				if (relation.user.displayName === null) {
					relation.user.displayName = relation.user.username;
				}
				if (relation.user.avatarID === 'default' || relation.user.avatarID === null) {
					relation.user.avatarID = '/images/default-profile.png';
				}
				if (relation.user.bannerID === null) {
					relation.user.bannerID = '/images/default-banner.png';
				}
				return relation;
			});
		return relationships;
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

		const relationships = res.data
			.filter(relation => relation.status === 2 && relation.user.userID !== userID)
			.map(relation => {
				if (relation.user.displayName === null) {
					relation.user.displayName = relation.user.username;
				}
				if (relation.user.avatarID === 'default' || relation.user.avatarID === null) {
					relation.user.avatarID = '/images/default-profile.png';
				}
				if (relation.user.bannerID === null) {
					relation.user.bannerID = '/images/default-banner.png';
				}
				return relation;
			})
			return relationships;
	} catch (err) {
		console.error(err.response?.data?.error || 'An error occurred');
		return [];
	}
};
