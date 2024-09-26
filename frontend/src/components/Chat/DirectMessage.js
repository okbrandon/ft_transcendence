import React, { useState, useContext, useEffect, useRef } from 'react';
import { Header } from './styles/Chat/ChatContainer.styled.js';
import CloseButton from 'react-bootstrap/CloseButton';
import Arrow from './tools/Arrow.js';
import { SendButton } from './tools/SendButton.js';
import { RelationContext } from '../../context/RelationContext.js';
import API from '../../api/api.js';
import ConfirmationModal from './tools/ConfirmationModal.js';
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
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const navigate = useNavigate();

	const realConvo = conversations.find(c => c.conversationID === conversationID);


	const toggleDropdown = (event) => {
		event.stopPropagation();
		console.log("Toggling dropdown");
		setIsDropdownOpen(!isDropdownOpen);
	}

	const handleBlockUser = () => {
		const other = realConvo.participants.find(id => id !== userID);

		if (!other || !other.userID) return;
		if (other.userID === userID) {
			console.error('You cannot block yourself');
			return;
		}

		API.put('users/@me/relationships', { user: other.userID, type: 2 })
			.then(() => {
				console.log('User blocked');
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
		setIsBlockModalOpen(false);
	}

	const handleDropdownAction = (action) => {
		console.log(action);
		switch (action) {
			case 'profile':
				navigate(`/profile/${username}`);
				break;
			case 'invite':
				console.log('invite'); // Waiting for gameserver
				break;
			case 'block':
				console.log('block');
				setIsBlockModalOpen(true);
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
		<>
		<DirectMessageContainer $isOpen={isOpen} $isMinimized={isMinimized}>
			<Header onClick={toggleMinimization}>
				<Username onClick={toggleDropdown}>{username}</Username>
				<Dropdown $isOpen={isDropdownOpen}>
					<DropdownItem data-action="profile" onClick={() => handleDropdownAction('profile')}>Profile</DropdownItem>
					<DropdownItem data-action="invite" onClick={() => handleDropdownAction('invite')}>Invite</DropdownItem>
					<DropdownItem data-action="block" onClick={() => handleDropdownAction('block')}>Block</DropdownItem>
				</Dropdown>
				<ActionButtonContainer>
					<Arrow ArrowAnimate={!isMinimized} />
					<CloseButton variant='white' onClick={onClose} />
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
						<SendButton onClick={handleMessage} disabled={content.trim() === ''}>
							<i className="bi bi-send-fill" />
						</SendButton>
					</ChatInputContainer>
				</>
			)}
		</DirectMessageContainer>

		<ConfirmationModal
			isOpen={isBlockModalOpen}
			onClose={() => setIsBlockModalOpen(false)}
			onConfirm={handleBlockUser}
			title="Block User"
			message={`Are you sure you want to block ${username}? You won't be able to see their messages or receive invitations from them.`}
		/>
	  </>
	);
};
