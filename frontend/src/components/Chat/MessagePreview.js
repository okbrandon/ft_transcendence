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

// export const MessagePreview = ({})

export const MessagePreview = ({ conversationsData, onSelectChat }) => {
	console.log('MessagePreview: conversationData ', conversationsData);

	return (
		<>
			{lastMessages.map((object, index) => (
				<PreviewContainer key={index} onClick={() => onSelectChat(object.sender.username)}>
					<ProfilePicture src={defaultAvatar} alt={`${lastMessages.sender}'s profile`} />
					<MessageContent>
						<Sender>{object.sender.username}</Sender>
						<MessageText>{object.content}</MessageText>
					</MessageContent>
				</PreviewContainer>
			))}


			{/* <PreviewContainer>


				{lastMessages ? (
					<>
						<ProfilePicture src={defaultAvatar} alt={`${lastMessages.sender}'s profile`} />
						<MessageContent>
							<Sender>{lastMessages.sender}</Sender>
							<MessageText>{lastMessages.text}</MessageText>
						</MessageContent>
					</>
				) : (
					<div>No messages to display</div>
				)}
			</PreviewContainer> */}
		</>
	);
};
