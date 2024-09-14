import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
import { Arrow } from './tools/Arrow.js';
import { ChatHeaderStyled } from './styles/Chat/ChatContainer.styled.js';
import DirectMessageContainer, { ChatMessages, ChatInputContainer, ChatInput, ActionButtonContainer } from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ({ friendname, messages, onClose, $isMinimized, onToggleMinimize }) => {
	const [isActive, setIsActive] = useState(true);
	const [isArrowActive, setIsArrowActive] = useState(true);

	const handleToggle = () => {
		setIsActive(!isActive);
		onToggleMinimize();
		setIsArrowActive(!isArrowActive);
	};

	return (
		<DirectMessageContainer $isMinimized={$isMinimized}>
			<ChatHeaderStyled onClick={handleToggle}>
				{friendname}
				<ActionButtonContainer>
					<Arrow
						onClick={handleToggle}
						ArrowAnimate={isArrowActive}/>
					<CloseButton variant='white' onClick={onClose} />
				</ActionButtonContainer>
			</ChatHeaderStyled>
			<ChatMessages $isMinimized={$isMinimized}>
				<div>{messages.text}</div>
			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}>
				<ChatInput placeholder="Type a message..." />
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
