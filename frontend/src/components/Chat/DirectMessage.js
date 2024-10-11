import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from 'react-bootstrap/CloseButton';

import { useRelation } from '../../context/RelationContext';
import { useNotification } from '../../context/NotificationContext';
import API from '../../api/api';

import { Header } from './styles/Chat/ChatContainer.styled';
import ProfilePicture from './styles/global/ProfilePicture.styled';
import DirectMessageContainer, {
	ChatMessages,
	Username,
	Dropdown,
	DropdownItem,
	ChatInputContainer,
	ChatInput,
	ActionButtonContainer
} from './styles/DirectMessage/DirectMessage.styled';

import Arrow from './tools/Arrow';
import { SendButton } from './tools/SendButton';
import ConfirmationModal from './tools/ConfirmationModal';
import DisplayChatMessages from './tools/DisplayChatMessages';
import useClickOutside from './tools/hooks/useClickOutside';

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
	const { sendMessage } = useRelation();
	const { addNotification } = useNotification();
	const messagesEndRef = useRef(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef(null);

	const realConvo = conversations.find(c => c.conversationID === conversationID);
	const otherUser = realConvo.participants.find(id => id.userID !== userID);
	const proPic = otherUser.avatarID || 'images/default-profile.png';

	const toggleDropdown = (event) => {
		event.stopPropagation();
		setIsDropdownOpen(!isDropdownOpen);
	}

	const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
	useClickOutside(dropdownRef, closeDropdown);

	const handleBlockUser = () => {
		const other = realConvo.participants.find(id => id.userID !== userID);

		if (!other || !other.userID) return;
		if (other.userID === userID) {
			addNotification('error', 'You cannot block yourself');
			return;
		}

		API.put('users/@me/relationships', { user: other.userID, type: 2 })
			.then(() => {
				addNotification('warning', 'User blocked.');
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
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

		sendMessage(JSON.stringify({ type: 'send_message', conversationID: conversationID, content: content, }))
		setContent('');
	};

	return (
		<>
		<DirectMessageContainer $isOpen={isOpen} $isMinimized={isMinimized}>
			<Header onClick={toggleMinimization}>
				<ProfilePicture src={proPic} alt={`${otherUser.username}'s profile picture`} $header />
				<Username onClick={toggleDropdown}>{username}</Username>
				<Dropdown ref={dropdownRef} $isOpen={isDropdownOpen}>
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
							as="textarea"
							placeholder="Type a message..."
							value={content}
							onChange={e => setContent(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									handleMessage();
								}
							}}
							maxLength={256}
							rows={1}
							style={{ resize: 'none', overflow: 'hidden' }}
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
