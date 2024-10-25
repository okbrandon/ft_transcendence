import React from 'react';
import {
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	TournamentInviteBubble,
	Avatar,
	MessageUsername
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
					) : (
						<div key={index}>
							{message.messageType === 1 ? (
							<TournamentInviteBubble>
								<p>Tournament Invitation</p>
								<p>{message.content}</p>
								<button>Accept</button>
								<button>Decline</button>
							</TournamentInviteBubble>
						) : message.sender.userID === userID ? (
								<>
									<MessageUsername $isHost={false}>You</MessageUsername>
									<SenderBubble data-time={formatTimestamp(message.createdAt)}>
										{message.content}
									</SenderBubble>
								</>
							) : (
								<>
									<MessageUsername $isHost={true}>
										<Avatar src={message.sender.avatarID || 'images/default-profile.png'} alt={message.sender.username} />
										{message.sender.username}
									</MessageUsername>
									<HostBubble data-time={formatTimestamp(message.createdAt)}>
										{message.content}
									</HostBubble>
								</>
							)}
						</div>
					)
				))}
				<div ref={messagesEndRef} />
			</>
		);
	}
};

export default DisplayChatMessages;
