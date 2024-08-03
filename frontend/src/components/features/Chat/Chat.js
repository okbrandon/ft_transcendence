import React, { useState } from 'react';
import {
	DropupContainer,
	DropupButton,
	DropupContent,
	FriendItem
} from '../../styles/chat/Chat.styled';

const Chat = () => {
	const [showChat, setShowChat] = useState(false);
	const [friends, setFriends] = useState([
	'Friend 1',
	'Friend 2',
	'Friend 3',
	'Friend 4',
	'Friend 5',
	'Friend 6',
	'Friend 7',
	'Friend 8',
	'Friend 9',
	`Friend 10`
	]);

	const toggleMenu = () => {
		setShowChat(!showChat);
	};

	const handleFriendClick = (friend) => {
		alert(`Chat with ${friend}`);
	};

	return (
		<DropupContainer>
			<DropupContent show={showChat}>
				<DropupButton onClick={toggleMenu} className={showChat ? 'expanded' : ''}>
					Messaging
				</DropupButton>
				{friends.map((friend, index) => (
					<FriendItem key={index} onClick={() => handleFriendClick(friend)}>
						{friend}
					</FriendItem>
				))}
			</DropupContent>
		</DropupContainer>
	);
};

export default Chat;
