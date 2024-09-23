import React from 'react';
import styled from 'styled-components';
import defaultAvatar from './img/default-avatar.jpg';
import ProfilePicture from './styles/global/ProfilePicture.styled';

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
`;

export const MessagePreview = ({ conversationsData, setFocusedConvID, handleSelectChat }) => {
	const userID = localStorage.getItem('userID');

	const handleSelectFriend = (convo) => {
		console.log('Selected conversation: ', convo);
		const other = convo.participants.find((participant) => participant.userID !== userID);

		const senderID = convo.participants.find((participant) => participant.userID !== convo.receipientID).userID;
		const sender = convo.participants.find((participant) => participant.userID === senderID);
		console.log('Selected sender: ', sender);
		setFocusedConvID(convo.conversationID);
		handleSelectChat(other.username);
	};

	return (
		<>
			{conversationsData.map((convo, index) => {
				if (convo.messages.length === 0) {
					const other = convo.participants.find((participant) => participant.userID === userID);
					return (
						<PreviewContainer key={index} onClick={() => handleSelectFriend(convo)}>
							<ProfilePicture src={other.avatarID === 'default' ? '/images/default-profile.png' : other.avatarID} alt={`${other.username}'s profile picture`} />
							<MessageContent>
								<Sender>{other.username}</Sender>
								<MessageText>No messages yet</MessageText>
							</MessageContent>
						</PreviewContainer>
					)
				}
				const other = convo.participants.find((participant) => participant.userID !== userID);
				const lastMessage = convo.messages[convo.messages.length - 1];
				const lastMessageContent = lastMessage.content;
				return (
					<PreviewContainer key={index} onClick={() => handleSelectFriend(convo)}>
						<ProfilePicture src={other.avatarID === 'default' ? '/images/default-profile.png' : other.avatarID} alt={`${other.username}'s profile picture`} />
						<MessageContent>
							<Sender>{other.username}</Sender>
							<MessageText>{lastMessageContent}</MessageText>
						</MessageContent>
					</PreviewContainer>
				)
			})}
		</>
	);
};
