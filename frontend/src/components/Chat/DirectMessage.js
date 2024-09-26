import React, { useState, useContext, useEffect, useRef } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow from './tools/Arrow.js';
import { RelationContext } from '../../context/RelationContext.js';
import { useNavigate } from 'react-router-dom';

import DirectMessageContainer, {
	ChatMessages,
	Username,
	Dropdown,
	DropdownItem,
	NewConversationMessage,
	SenderBubble,
	HostBubble,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled.js';

const DisplayChatMessages = ({ realConvo, userID, messagesEndRef, otherUser }) => {
	if (!realConvo || realConvo.messages.length === 0) {
		return (
			<NewConversationMessage>
				It's your first time chatting with {otherUser}. Say hi, don't be shy!
			</NewConversationMessage>
		);
	} else {
		return (
			<>
				{realConvo.messages.map((message, index) => {
					return message.sender.userID === userID ? (
						<SenderBubble key={index}>{message.content}</SenderBubble>
					) : (
						<HostBubble key={index}>{message.content}</HostBubble>
					);
				})}
				<div ref={messagesEndRef} />
			</>
		);
	}
};

export const DirectMessage = ({
	isOpen,
	conversationID,
	conversations,
	username,
	onClose,
	isMinimized,
	toggleMinimization,
}) => {
	const userID = localStorage.getItem('userID');
	const [content, setContent] = useState('');
	const { sendMessage } = useContext(RelationContext);
	const messagesEndRef = useRef(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const navigate = useNavigate();

	const realConvo = conversations.find(c => c.conversationID === conversationID);

	const toggleDropdown = (event) => {
		event.stopPropagation();
		console.log("Toggling dropdown");
		setIsDropdownOpen(!isDropdownOpen);
	}

	const handleDropdownAction = (event, action) => {
		console.log("action: ");

		switch (action) {
			case 'profile':
				navigate(`/profile/${username}`);
				break;
			case 'invite':
				console.log('invite');
				break;
			case 'block':
				console.log('block');
				break;
			default:
				break;
		}
		setIsDropdownOpen(false);
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [realConvo?.messages]);


	const handleMessage = () => {
		if (content.trim() === '') return;

		sendMessage(JSON.stringify({
			type: 'send_message',
			conversationID: conversationID,
			content: content,
		}))
		setContent('');
	};

	return (
		<DirectMessageContainer $isOpen={isOpen} $isMinimized={isMinimized}>
			<Header onClick={toggleMinimization}>
				<Username onClick={toggleDropdown}>{username}</Username>
				<Dropdown $isOpen={isDropdownOpen}>
					<DropdownItem data-action="profile" onClick={(e) => handleDropdownAction(e, 'profile')}>Profile</DropdownItem>
					<DropdownItem data-action="invite" onClick={(e) => handleDropdownAction(e, 'invite')}>Invite</DropdownItem>
					<DropdownItem data-action="block" onClick={(e) => handleDropdownAction(e, 'block')}>Block</DropdownItem>
				</Dropdown>
				<ActionButtonContainer>
					<Arrow ArrowAnimate={!isMinimized} />
					<CloseButton variant='white' onClick={(e) => { onClose(); }} />
				</ActionButtonContainer>
			</Header>

			{isOpen && !isMinimized && (
				<>
					<ChatMessages>
						<DisplayChatMessages
							realConvo={realConvo}
							userID={userID}
							messagesEndRef={messagesEndRef}
							otherUser={username}
						/>
					</ChatMessages>

					<ChatInputContainer>
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
				</>
			)}
		</DirectMessageContainer>
	);
};
