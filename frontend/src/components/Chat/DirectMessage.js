import React, { useState, useContext, useEffect } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow from './tools/Arrow.js';
import { ChatContext } from '../../context/ChatContext.js'; // Import WebSocket context

import DirectMessageContainer, {
	ChatMessages,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ({ conversationID, conversations, username, onClose, $isMinimized, toggleMinimization, arrowState }) => {
	const [content, setContent] = useState(''); // Track the message being typed
	const { sendMessage } = useContext(ChatContext); // Get WebSocket context
	const [realConvo, setRealConvo] = useState(null); // CACA
	const userID = localStorage.getItem('userID');

	useEffect(() => {
		setRealConvo(conversations.find(c => c.conversationID === conversationID));
	}, [conversations]);

	if (!realConvo) return null;
	// 2. Handle sending new messages
	const handleMessage = () => {
		if (content.trim() === '') return; // Prevent sending empty messages

		const messageData = {
			type: 'send_message',
			conversationID: realConvo.conversationID,
			content: content,
		};

		sendMessage(JSON.stringify(messageData)); // Send the message via WebSocket
		setContent(''); // Clear the input field
	};
	console.log(realConvo);
	// 3. Render the messages
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
				{/* Combine the historical messages and WebSocket messages */}
				{/* {combinedMessages.map((message, index) => {
					const isSender = message.sender.username === convo.participants.find(p => p.userID === convo.receipientID)?.username;

					return isSender ? (
						<SenderBubble key={index}>{message.content}</SenderBubble>
					) : (
						<HostBubble key={index}>{message.content}</HostBubble>
					);
				})} */}
				{realConvo.messages.map((message, index) => {
					return message.sender.userID === userID ? (
						<SenderBubble key={index}>{message.content}</SenderBubble>
					) : (
						<HostBubble key={index}>{message.content}</HostBubble>
					);
				})}
			</ChatMessages>

			{/* Chat input for typing new messages */}
			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput
					placeholder="Type a message..."
					value={content}
					onChange={e => setContent(e.target.value)} // Update input content
					onKeyDown={e => {
						if (e.key === 'Enter') {
							handleMessage(); // Send message on Enter key press
						}
					}}
				/>
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
