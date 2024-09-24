import React, { useState, useContext, useEffect, useRef } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow from './tools/Arrow.js';
import { ChatContext } from '../../context/ChatContext.js';

import DirectMessageContainer, {
	ChatMessages,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ({ conversationID, conversations, username, onClose, $isMinimized, toggleMinimization, arrowState }) => {
	const userID = localStorage.getItem('userID');

	const [content, setContent] = useState('');
	const { sendMessage } = useContext(ChatContext);
	const [realConvo, setRealConvo] = useState(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		setRealConvo(conversations.find(c => c.conversationID === conversationID));
	}, [conversations]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [realConvo?.messages]);

	if (!realConvo) return null;

	const handleMessage = () => {
		if (content.trim() === '') return;

		const messageData = {
			type: 'send_message',
			conversationID: realConvo.conversationID,
			content: content,
		};

		sendMessage(JSON.stringify(messageData));
		setContent('');
	};

	return (
		<DirectMessageContainer $isMinimized={$isMinimized}>
			<Header onClick={toggleMinimization}>
				{username}
				<ActionButtonContainer>
					<Arrow ArrowAnimate={arrowState} />
					<CloseButton variant='white' onClick={onClose} />
				</ActionButtonContainer>
			</Header>

			<ChatMessages $isMinimized={$isMinimized}>
				{realConvo.messages.map((message, index) => {
					return message.sender.userID === userID ? (
						<SenderBubble key={index}>{message.content}</SenderBubble>
					) : (
						<HostBubble key={index}>{message.content}</HostBubble>
					);
				})}
				<div ref={messagesEndRef} />
			</ChatMessages>

			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput
					placeholder="Type a message..."
					value={content}
					onChange={e => setContent(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							handleMessage();
						}
					}}
				/>
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
