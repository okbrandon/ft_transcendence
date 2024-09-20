import React, { useState } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow  from './tools/Arrow.js';
import DirectMessageContainer, {
	ChatMessages,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ( { convo, username, onClose, $isMinimized, toggleMinimization, isArrowActive }) => {
	return (
		<DirectMessageContainer $isMinimized={$isMinimized}>
			<Header onClick={toggleMinimization}>
				{username}
				<ActionButtonContainer>
					<Arrow ArrowAnimate={isArrowActive} />
					<CloseButton variant='white' onClick={onClose} />
				</ActionButtonContainer>
			</Header>
			<ChatMessages $isMinimized={$isMinimized}>
				{/* Display all messages using API */}

			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput placeholder="Type a message..." />
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
