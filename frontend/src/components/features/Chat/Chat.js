import React, { useState } from 'react';
import {
	DropupContainer,
	DropupButton,
	DropupContent,
	FriendItem
} from '../../styles/chat/Chat.styled';

const Chat = () => {
	const [showChat, setshowChat] = useState(false);
	const [friends, setFriends] = useState([
		'Friend 1',
		'Friend 2',
		'Friend 3',
		'Friend 4',
		'Friend 5'
	]);

	const toggleMenu = () => {
		setshowChat(!showChat);
	};

	const handleFriendClick = (friend) => {
		alert(`Chat with ${friend}`);
	};

	return (
		<DropupContainer>
			<DropupButton onClick={toggleMenu}>
				Messaging
			</DropupButton>
			<DropupContent show={showChat}>
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
