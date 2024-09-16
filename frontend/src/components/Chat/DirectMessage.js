import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/CloseButton';
import { Arrow } from './tools/Arrow.js';
import { ChatHeaderStyled } from './styles/Chat/ChatContainer.styled.js';
import DirectMessageContainer, { ChatMessages, ChatInputContainer, ChatInput, ActionButtonContainer } from './styles/DirectMessage/DirectMessage.styled.js';
import ProfilePicture from './styles/global/ProfilePicture.styled.js';
import API from '../../api/api';

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
			<ChatHeaderStyled onClick={handleToggle}> {/* Direct Message Header */}
				{friendname}
				<ActionButtonContainer>  {/* Buttons on the right hand-side */}
					<Arrow
						onClick={handleToggle}
						ArrowAnimate={isArrowActive}/>
					<CloseButton variant='white' onClick={onClose} />
				</ActionButtonContainer>
			</ChatHeaderStyled>
			<ChatMessages $isMinimized={$isMinimized}> {/* Chat Messages */}
				{API.get('chat/conversations')
					.then((response) => {
						console.log('(ChatMessages); Harvested data: ', response.data);
					})
					.catch((error) => {
						console.log('FAILED TO HARVEST: ', error);
					})
				}
				<div>{messages.text}</div>
			</ChatMessages>
			<ChatInputContainer $isMinimized={$isMinimized}> {/* Chat Input */}
				<ChatInput placeholder="Type a message..." />
			</ChatInputContainer>
		</DirectMessageContainer>
	);
};
