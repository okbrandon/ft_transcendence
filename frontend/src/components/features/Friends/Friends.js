import React from 'react';
import StyledFriendsContainer from '../../styles/layouts/FriendsContainer.styled';

const Friends = ({ showFriends, handleFriends }) => {
	return (
		<StyledFriendsContainer show={showFriends} onHide={handleFriends}>
			<StyledFriendsContainer.Header closeButton>
				<StyledFriendsContainer.Title>Friends</StyledFriendsContainer.Title>
			</StyledFriendsContainer.Header>
			<StyledFriendsContainer.Body>
				NO FRIENDS
			</StyledFriendsContainer.Body>
		</StyledFriendsContainer>
	);
};

export default Friends;
