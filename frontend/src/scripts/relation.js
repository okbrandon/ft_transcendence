export const GetOtherFromRelationship = (relationship, userID) => {
	return relationship.sender.userID === userID ? { ...relationship.target, is: 'target' } : { ...relationship.sender , is: 'sender' };
};
