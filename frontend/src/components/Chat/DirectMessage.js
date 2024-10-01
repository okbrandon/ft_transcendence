import React, { useState } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow  from './tools/Arrow.js';
import useWebSocket from 'react-use-websocket';

import DirectMessageContainer, {
	ChatMessages,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

const SendMessage = (content, conversationID) => {
	const message = {
		type: 'send_message',
		conversationID: conversationID,
		content: content
	};
	// Send the message to the server WebSocket
	//sendMessage(JSON.stringify(message)); this is undefined uncomment me when im defined otherwise i break build step
}

export const DirectMessage = ( { convo, username, onClose, $isMinimized, toggleMinimization, arrowState }) => {
	const [content, setContent] = useState('');
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
					value={content}
					onChange={e => ({})} /> 
					{/* was onChange={e => setInput(e.target.value)}, removed bcuz setInput was undefined and it broke build step /> */}
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

	Where the conversationID is the conversation ID where the message is sent and content is the message content.

	Once received, the server will add the message to the conversation messages and send a Websocket notification to the participants of the conversation to tell them that they need to request the conversations again.
*/
