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
} from '../styles/DirectMessage/DirectMessage.styled.js';
import { useNotification } from '../../../context/NotificationContext.js';
import API from '../../../api/api.js';
import { useNavigate } from 'react-router-dom';
import Card from '../../../styles/shared/Card.styled.js';
import { useTournament } from '../../../context/TournamentContext.js';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	const { addNotification } = useNotification();
	const { registerForTournament } = useTournament();
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
			navigate(`/tournaments/${tournamentID}`);
			registerForTournament(tournamentID);
		} catch (error) {
			console.log(error);
			addNotification('error', error?.response?.data?.error || 'Error accepting tournament invite');
		}
	}

	const handleAcceptChallengeInvite = async (challengerID, inviteID) => {
		try {
			await API.post(`/users/${challengerID}/challenge/${inviteID}/accept`);
			addNotification('success', 'Challenge invite accepted');
			navigate('/game-challenge');
		} catch (error) {
			console.log(error);
			addNotification('error', error?.response?.data?.error || 'Error accepting challenge invite');
		}
	}

	const handleDenyChallengeInvite = async (challengerID, inviteID) => {
		try {
			await API.post(`/users/${challengerID}/challenge/${inviteID}/deny`);
			addNotification('success', 'Challenge invite denied');
		} catch (error) {
			console.log(error);
			addNotification('error', error?.response?.data?.error || 'Error denying challenge invite');
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
		console.log(realConvo);

		return (
			<ChatBubbleContainer>
				{realConvo.messages.map((message, index) => {
					const isSameSender = message.sender.userID === previousSenderID;
					previousSenderID = message.sender.userID;

					if (message.messageType === 1) { // Tournament invite
						return (
							<MessageWrapper key={index} $isHost={false}>
								<BubbleDetails>
									<Card $width={'270px'} $height={'200px'}>
										<div className='bg'>
											<h3>Tournament</h3>
											<p>I invite you to join <b>{message.tournamentInvite.tournament.name}</b></p>
											<button onClick={() => handleAcceptTournamentInvite(message.tournamentInvite.tournament.tournamentID)}>Join</button>
										</div>
										<div className='blob'/>
									</Card>
								</BubbleDetails>
							</MessageWrapper>
						)
					} else if (message.messageType === 3) { // Challenge invite
						return (
							<MessageWrapper key={index} $isHost={false}>
								<BubbleDetails>
									<Card $width={'290px'} $height={'250px'}>
										<div className='bg'>
											<h3>Challenge</h3>
											<p>I challenge you to play against <b>me</b></p>
											<div className='button-container'>
												<button onClick={() => handleAcceptChallengeInvite(message.sender.userID, message.challengeInvite.inviteID)}>Accept</button>
												<button onClick={() => handleDenyChallengeInvite(message.sender.userID, message.challengeInvite.inviteID)}>Decline</button>
											</div>
										</div>
										<div className='blob'/>
									</Card>
								</BubbleDetails>
							</MessageWrapper>
						)
					}
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
				})}
				<div ref={messagesEndRef} />
			</ChatBubbleContainer>
		);
	}
};

export default DisplayChatMessages;
