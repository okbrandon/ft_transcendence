import React from 'react';
import {
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	Avatar,
	MessageUsername,
} from '../styles/DirectMessage/DirectMessage.styled.js';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	if (!realConvo || realConvo.messages.length === 0) {
		return (
			<NewConversationMessage>
				It's your first time chatting with {otherUser}. Say hi, don't be shy!
			</NewConversationMessage>
		);
	} else {
		return (
			<>
				{realConvo.messages.map((message, index) => (
					<div key={index}>
						{message.sender.userID === userID ? (
							<>
								<MessageUsername $isHost={false}>You</MessageUsername>
								<SenderBubble
									data-time={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								>
									{message.content}
								</SenderBubble>
							</>
						) : (
							<>
								<MessageUsername $isHost={true}>
									<Avatar src={message.sender.avatarID || 'images/default-profile.png'} alt={message.sender.username} />
									{message.sender.username}
								</MessageUsername>
								<HostBubble
									data-time={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								>
									{message.content}
								</HostBubble>
							</>
						)}
					</div>
				))}
				<div ref={messagesEndRef} />
			</>
		);
	}
};

export default DisplayChatMessages;
