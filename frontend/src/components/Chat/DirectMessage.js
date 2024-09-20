import React, { useState } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow  from './tools/Arrow.js';
import DirectMessageContainer, {
	ChatMessages,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ( { convo, username, onClose, $isMinimized, toggleMinimization, arrowState }) => {
	const [input, setInput] = useState('');
	console.log('DirectMessage displaying (convo): ', convo);
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
				{/* Display all the messages */}
				{convo.messages.map((message, index) => {
					if (message.sender.username === username) {
						return <SenderBubble key={index}>{message.content}</SenderBubble>;
					} else {
						return <HostBubble key={index}>{message.content}</HostBubble>;
					}
				})}
			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput
					placeholder="Type a message..."
					value={input}
					onChange={e => setInput(e.target.value)} />
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};

/*
Sending a message:

	When sending a message, the user sends a JSON object to the Websocket connection previously established at the authentication. The JSON object must contain the following fields:


	{
		"type": "send_message",
		"conversationID": "546a31fd-fb13-4b8f-8cbb-b3ac59c7d52c",
		"content": "Hello, how are you?"
	}
*/
