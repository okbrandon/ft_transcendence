import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import defaultAvatar from './img/default-avatar.jpg';
import ProfilePicture from './styles/global/ProfilePicture.styled';
import ScrollableComponent from './tools/ScrollableComponent';
import { GetFriends } from '../../api/friends';

const PreviewContainer = styled.div`
	padding: 10px;
	border-top: 1px solid #ddd;
	color: #333;
	display: flex;
	align-items: center;
	cursor: pointer;
`;

const MessageContent = styled.div`
	display: flex;
	flex-direction: column;
`;

const Sender = styled.strong`
	font-size: 1.1rem;
`;

const MessageText = styled.span`
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.5;
	font-size: 0.9rem;
`;

const NoFriendsMessage = styled.div`
	padding: 20px;
	text-align: center;
	color: #666;
	font-size: 1.2rem;
`;

export const MessagePreview = ({ conversationsData, setFocusedConvID, handleSelectChat }) => {
	const userID = localStorage.getItem('userID');
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFriends = async () => {
			const friendsData = await GetFriends();
			setFriends(friendsData);
			setLoading(false);
		};
		fetchFriends();
	}, []);

	const handleSelectFriend = (friend) => {
		handleSelectChat(friend.username);
		setFocusedConvID(friend.userID);
	};

	const renderFriendPreview = (friend, index, message = 'Click to start a conversation') => (
		<PreviewContainer key={index} onClick={() => handleSelectFriend(friend)}>
			<ProfilePicture
				src={defaultAvatar}
				alt={`${friend.username}'s profile picture`}
			/>
			<MessageContent>
				<Sender>{friend.username}</Sender>
				<MessageText>{message}</MessageText>
			</MessageContent>
		</PreviewContainer>
	);

	// Loading state
	if (loading) {
		return <NoFriendsMessage>Loading friends...</NoFriendsMessage>;
	}

	// No friends found
	if (friends.length === 0) {
		return <NoFriendsMessage>No friends yet</NoFriendsMessage>;
	}

	// No conversations, but we have friends
	if (conversationsData.length === 0) {
		return (
			<ScrollableComponent>
				{friends.map((friend, index) =>
					renderFriendPreview(friend, index)
				)}
			</ScrollableComponent>
		);
	}

	// If there are conversations, render them
	return (
		<ScrollableComponent>
			{conversationsData.map((convo, index) => {
				const other = convo.participants.find(participant => participant.userID !== userID);

				if (convo.messages.length === 0) {
					return renderFriendPreview(other, index, 'No messages yet');
				}

				// Last message in conversation
				const lastMessage = convo.messages[convo.messages.length - 1];
				return renderFriendPreview(other, index, lastMessage.content);
			})}
		</ScrollableComponent>
	);
};
