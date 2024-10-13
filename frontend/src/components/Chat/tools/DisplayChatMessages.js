import React from 'react';
import {
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	TournamentInviteBubble
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
					message.messageType === 1 ? (
						<TournamentInviteBubble key={index}>
							<p>Tournament Invitation</p>
							<p>Summer championship</p>
							<button>Accept</button>
							<button>Decline</button>
						</TournamentInviteBubble>
					) : message.sender.userID === userID ? (
						<SenderBubble key={index}>{message.content}</SenderBubble>
					) : (
						<HostBubble key={index}>{message.content}</HostBubble>
					)
				))}
				<div ref={messagesEndRef} />
			</>
		);
	}
};

export default DisplayChatMessages;
