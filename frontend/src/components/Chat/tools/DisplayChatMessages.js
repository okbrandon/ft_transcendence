import React from 'react';
import {
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	Avatar,
	MessageUsername,
	ChatBubbleContainer,
	MessageWrapper,
	BubbleDetails
} from '../styles/DirectMessage/DirectMessage.styled.js';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		if (isNaN(date.getTime())) {
			return 'Invalid Date';
		}
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	if (!realConvo || realConvo.messages.length === 0) {
		return (
			<NewConversationMessage>
				It's your first time chatting with {otherUser}. Say hi, don't be shy!
			</NewConversationMessage>
		);
	} else {
		let previousSenderID = null;

		return (
			<ChatBubbleContainer>
				{realConvo.messages.map((message, index) => {
					const isSameSender = message.sender.userID === previousSenderID;
					previousSenderID = message.sender.userID;

					return (
						<MessageWrapper key={index} $isHost={message.sender.userID === userID}>
							{message.sender.userID === userID ? (
								<BubbleDetails>
									{!isSameSender && <MessageUsername $isHost={false}>You</MessageUsername>}
									<HostBubble data-time={formatTimestamp(message.createdAt)} $isRounded={isSameSender}>
										{message.content}
									</HostBubble>
								</BubbleDetails>
							) : (
								<BubbleDetails>
									{!isSameSender && (
										<MessageUsername $isHost={true}>
											<Avatar src={message.sender.avatarID || 'images/default-profile.png'} alt={message.sender.username} />
											{message.sender.username}
										</MessageUsername>
									)}
									<SenderBubble data-time={formatTimestamp(message.createdAt)} $isRounded={isSameSender}>
										{message.content}
									</SenderBubble>
								</BubbleDetails>
							)}
						</MessageWrapper>
					);
				})}
				<div ref={messagesEndRef} />
			</ChatBubbleContainer>
		);
	}
};

export default DisplayChatMessages;
