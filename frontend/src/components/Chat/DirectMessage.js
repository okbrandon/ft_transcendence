import React, { useState, useContext } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow  from './tools/Arrow.js';
import { ChatContext } from '../../context/ChatContext.js';

import DirectMessageContainer, {
	ChatMessages,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ( { convo, username, onClose, $isMinimized, toggleMinimization, arrowState }) => {
	const [content, setContent] = useState('');
	const { sendMessage } = useContext(ChatContext);
	const { messageHistory } = useContext(ChatContext);

	const handleMessage = () => {
		// handle sending empty string message
		if (content.trim === '') { return ; }

		const messageData = {
			type: 'send_message',
			conversationID: convo.conversationID,
			content: content,
		};

		sendMessage(JSON.stringify(messageData)); // send message to websocket
		setContent(''); // clear input
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
				{convo.messages.map((message, index) => {
					const senderID = convo.participants.find((participant) => participant.userID !== convo.receipientID).userID;
					const sender = convo.participants.find((participant) => participant.userID === senderID);
					if (sender !== convo.receipientID) {
						return (
							<SenderBubble key={index}>
								{message.content}
							</SenderBubble>
						);
					} else {
						return (
							<HostBubble key={index}>
								{message.content}
							</HostBubble>
						);
					}
				})}
			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput
					placeholder="Type a message..."
					value={content}
					onChange={e => setContent(e.target.value)} // Update content on input change
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
