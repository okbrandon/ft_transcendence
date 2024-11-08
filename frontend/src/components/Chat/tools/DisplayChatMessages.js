import React from 'react';
import {
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	Avatar,
	MessageUsername,
	ChatBubbleContainer,
	MessageWrapper,
	BubbleDetails,
	TournamentInviteBubble
} from '../styles/DirectMessage/DirectMessage.styled.js';
import { useNotification } from '../../../context/NotificationContext.js';
import API from '../../../api/api.js';
import { useNavigate } from 'react-router-dom';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	const { addNotification } = useNotification();
	const navigate = useNavigate();

	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		if (isNaN(date.getTime())) {
			return 'Invalid Date';
		}
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleAcceptTournamentInvite = async (tournamentID) => {
		try {
			await API.post(`/tournaments/${tournamentID}/invite/accept`);
			addNotification('success', 'Tournament invite accepted');
			navigate(`/tournaments/${tournamentID}`);
		} catch (error) {
			console.log(error);
			addNotification('error', error?.response?.data?.error || 'Error accepting tournament invite');
		}
	}

	if (!realConvo || realConvo.messages.length === 0) {
		return (
			<NewConversationMessage>
				It's your first time chatting with {otherUser}. Say hi, don't be shy!
			</NewConversationMessage>
		);
	} else {
		let previousSenderID = null;
		console.log('DisplayChatMessages.js:', realConvo);

		return (
			<ChatBubbleContainer>
				{realConvo.messages.map((message, index) => {
					const isSameSender = message.sender.userID === previousSenderID;
					previousSenderID = message.sender.userID;

					if (message.messageType === 0) {
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
												<Avatar src={message.sender.avatarID} alt={message.sender.username} />
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
					} else {
						return (
							<MessageWrapper key={index} $isHost={false}>
								<BubbleDetails>
									<TournamentInviteBubble>
										<div className='bg'>
											<h3>Tournament</h3>
											<p>I invite you to join <b>{message.invite.tournament.name}</b></p>
											<button onClick={() => handleAcceptTournamentInvite(message.invite.tournament.tournamentID)}>Join</button>
										</div>
										<div className='blob'>
										</div>
									</TournamentInviteBubble>
								</BubbleDetails>
							</MessageWrapper>
						)
					}
				})}
				<div ref={messagesEndRef} />
			</ChatBubbleContainer>
		);
	}
};

export default DisplayChatMessages;
