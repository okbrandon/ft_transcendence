import React from 'react';
import StyledFriendsList from '../../styles/features/FriendsList.styled';

const FriendsList = ({ showFriends, handleFriends }) => {
	return (
		<StyledFriendsList show={showFriends} onHide={handleFriends}>
			<StyledFriendsList.Header closeButton>
				<StyledFriendsList.Title>Friends</StyledFriendsList.Title>
			</StyledFriendsList.Header>
			<StyledFriendsList.Body>
				NO FRIENDS
			</StyledFriendsList.Body>
		</StyledFriendsList>
	);
};

export default FriendsList;
