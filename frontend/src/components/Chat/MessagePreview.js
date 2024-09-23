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
	return (
		<>
			{conversationsData.map((convo, index) => {
				if (convo.messages.length === 0) {
					return null;
				}
				let lastMessageContent = convo.messages[convo.messages.length - 1].content;
				let sender = convo.messages[convo.messages.length - 1].sender;
				return (
					<PreviewContainer key={index} onClick={() => onSelectChat(convo)}>
						<ProfilePicture src={defaultAvatar} alt={'profile'} />
						<MessageContent>
							<Sender>{sender.username}</Sender>
							<MessageText>{lastMessageContent}</MessageText>
						</MessageContent>
					</PreviewContainer>
				)
			})}
		</>
	);
};
