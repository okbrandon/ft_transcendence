import { formatUserData } from "../api/user";

const GetOtherFromRelationship = (relationship, userID) => {
	return relationship.sender.userID === userID ? { ...relationship.target, is: 'target' } : { ...relationship.sender , is: 'sender' };
};

export const GetUserFromRelation = (relations, profileUsername) => {
	const user = relations.filter(relation => relation.sender.username === profileUsername || relation.target.username === profileUsername);
	return user;
}

export const GetFriends = relations => {
	const userID = localStorage.getItem('userID');
	const friends = relations
		.filter(relation => relation.status === 1)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const friend = GetOtherFromRelationship(relation, userID);
			return { ...friend, relationID: relation.relationshipID };
		});
	if (!friends) return [];
	return friends;
};

export const GetRequests = relations => {
	const userID = localStorage.getItem('userID');
	const requests = relations
		.filter(relation => relation.status === 0)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const request = GetOtherFromRelationship(relation, userID);
			return { ...request, relationID: relation.relationshipID };
		});
	if (!requests) return [];
	return requests;
};

export const GetBlockedUsers = relations => {
	const userID = localStorage.getItem('userID');
	const blockedUsers = relations
		.filter(relation => relation.status === 2)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const blockedUser = GetOtherFromRelationship(relation, userID);
			return { ...blockedUser, relationID: relation.relationshipID };
		})
		.filter(user => user.is === 'target');
	if (!blockedUsers) return [];
	return blockedUsers;
};
