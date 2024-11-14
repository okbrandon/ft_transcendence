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
import { useTranslation, Trans } from 'react-i18next';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	const { addNotification } = useNotification();
	const { registerForTournament } = useTournament();
	const navigate = useNavigate();
	const { t } = useTranslation();

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
			addNotification('success', t('chat.invite.inviteAccepted'));
			navigate(`/tournaments/${tournamentID}`);
			registerForTournament(tournamentID);
		} catch (error) {
			addNotification('error', error?.response?.data?.error || t('chat.invite.errorAccept'));
		}
	}

	const handleAcceptChallengeInvite = async (challengerID, inviteID) => {
		try {
			await API.post(`/users/${challengerID}/challenge/${inviteID}/accept`);
			addNotification('success', t('chat.invite.inviteAccepted'));
			navigate('/game-challenge?inviteID=' + inviteID);
		} catch (error) {
			addNotification('error', error?.response?.data?.error || t('chat.invite.errorAccept'));
		}
	}

	const handleDenyChallengeInvite = async (challengerID, inviteID) => {
		try {
			await API.post(`/users/${challengerID}/challenge/${inviteID}/deny`);
			addNotification('success', t('chat.invite.inviteDeclined'));
		} catch (error) {
			addNotification('error', error?.response?.data?.error || t('chat.invite.errorDecline'));
		}
	}

	if (!realConvo || realConvo.messages.length === 0) {
		return (
			<NewConversationMessage>
				{t('chat.message.noMessages', { username: `${otherUser}` })}
			</NewConversationMessage>
		);
	} else {
		let previousSenderID = null;

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
											<h3>{t('chat.invite.tournament.title')}</h3>
											<p>
												<Trans i18nKey="chat.invite.tournament.content" components={[<strong key="first"/>]} values={{
													tournamentName: `${message.tournamentInvite.tournament.name}`
												}} />
											</p>
											<button onClick={() => handleAcceptTournamentInvite(message.tournamentInvite.tournament.tournamentID)}>{t('chat.invite.tournament.acceptButton')}</button>
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
											<h3>{t('chat.invite.challenge.title')}</h3>
											<p>
												<Trans i18nKey="chat.invite.challenge.content" components={[<strong key="first"/>]} />
											</p>
											<div className='button-container'>
												<button onClick={() => handleAcceptChallengeInvite(message.sender.userID, message.challengeInvite.inviteID)}>{t('chat.invite.challenge.acceptButton')}</button>
												<button onClick={() => handleDenyChallengeInvite(message.sender.userID, message.challengeInvite.inviteID)}>{t('chat.invite.challenge.declineButton')}</button>
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
									{!isSameSender && <MessageUsername $isHost={false}>{t('chat.message.sentByMe')}</MessageUsername>}
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
