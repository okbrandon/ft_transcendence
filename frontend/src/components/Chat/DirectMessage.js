import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
import { Arrow } from './tools/Arrow.js';
import { ChatHeaderStyled } from './styles/Chat/ChatContainer.styled.js';
import DirectMessageContainer, {
	ChatMessages,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

export const DirectMessage = ( { selectedChatID, conversationsData, onClose, $isMinimized, onToggleMinimize }) => {
	const [isActive, setIsActive] = useState(true);
	const [isArrowActive, setIsArrowActive] = useState(true);

	const handleToggle = () => {
		setIsActive(!isActive);
		onToggleMinimize();
		setIsArrowActive(!isArrowActive);
	};
	console.log('AHHHHHHHH');
	console.log('DirectMessage: selectedChatID: ', selectedChatID.username);


	return (
		<DirectMessageContainer $isMinimized={$isMinimized}>
			<ChatHeaderStyled onClick={handleToggle}> {/* Direct Message Header */}
				{selectedChatID}
				<ActionButtonContainer>  {/* Buttons on the right hand-side */}
					<Arrow
						onClick={handleToggle}
						ArrowAnimate={isArrowActive}/>
					<CloseButton variant='white' onClick={onClose} />
				</ActionButtonContainer>
			</ChatHeaderStyled>
			<ChatMessages $isMinimized={$isMinimized}> {/* Chat Messages */}
				{/* Display all messages using API */}

			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}> {/* Chat Input */}
				<ChatInput placeholder="Type a message..." />
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
