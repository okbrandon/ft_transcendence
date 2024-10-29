import { formatUserData } from "../api/user";

const getOtherFromRelationship = (relationship, userID) => {
	return relationship.sender.userID === userID ? { ...relationship.target, is: 'target' } : { ...relationship.sender , is: 'sender' };
};

export const getRelationFromUsername = (relations, profileUsername) => {
	const relation = relations.filter(relation => relation.sender.username === profileUsername || relation.target.username === profileUsername);
	return relation;
}

export const getFriends = (relations, userID) => {
	const friends = relations
		.filter(relation => relation.status === 1)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const friend = getOtherFromRelationship(relation, userID);
			return { ...friend, relationshipID: relation.relationshipID };
		});
	if (!friends) return [];
	return friends;
};

export const getRequests = (relations, userID) => {
	const requests = relations
		.filter(relation => relation.status === 0)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const request = getOtherFromRelationship(relation, userID);
			return { ...request, relationshipID: relation.relationshipID };
		});
	if (!requests) return [];
	return requests;
};

export const getBlockedUsers = (relations, userID) => {
	const blockedUsers = relations
		.filter(relation => relation.status === 2)
		.map(relation => {
			relation.sender = formatUserData(relation.sender);
			relation.target = formatUserData(relation.target);
			const blockedUser = getOtherFromRelationship(relation, userID);
			return { ...blockedUser, relationshipID: relation.relationshipID };
		})
		.filter(user => user.is === 'target');
	if (!blockedUsers) return [];
	return blockedUsers;
};
