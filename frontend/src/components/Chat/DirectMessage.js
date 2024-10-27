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

import { OnlineStatus } from './tools/OnlineStatus';
import Arrow from './tools/Arrow';
import { SendButton } from './tools/SendButton';
import ConfirmationModal from './tools/ConfirmationModal';
import DisplayChatMessages from './tools/DisplayChatMessages';
import useClickOutside from './tools/hooks/useClickOutside';
import { getRelationFromUsername } from '../../scripts/relation';
import { useChat } from '../../context/ChatContext';

export const DirectMessage = ({
	isOpen,
	conversationID,
	conversations,
	username,
	onClose,
	isMinimized,
	toggleMinimization,
}) => {
	const navigate = useNavigate();

	const { setIsRefetch, relations } = useRelation();
	const { sendMessage } = useChat();
	const { addNotification } = useNotification();

	const messagesEndRef = useRef(null);
	const dropdownRef = useRef(null);

	const [content, setContent] = useState('');
	const [charCount, setCharCount] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
	const [isBlocked, setIsBlocked] = useState(false);
	const userID = localStorage.getItem('userID');

	const realConvo = conversations.find(c => c.conversationID === conversationID);
	const otherUser = realConvo.participants.find(id => id.userID !== userID);

	useEffect(() => {
		if (!relations) return;

		const relation = getRelationFromUsername(relations, username);
		if (relation && relation[0]?.status === 2) {
			setIsBlocked(true);
		} else {
			setIsBlocked(false);
		}
	}, [relations, username]);

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
				addNotification('warning', `User ${username} blocked.`);
				setIsRefetch(true);
				onClose();
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
		setIsBlockModalOpen(false);
	}

	const handleDropdownAction = (action) => {
		switch (action) {
			case 'profile':
				navigate(`/profile/${username}`);
				break;
			case 'invite':
				break;
			case 'block':
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

	useEffect(() => {
		if (!isMinimized && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [isMinimized]);

	const handleMessage = () => {
		if (content.trim() === '') return;

		setIsRefetch(true);

		if (isBlocked) {
			setContent('');
			setCharCount(0);
			onClose();
			addNotification('error', 'An error occurred.'); // not sure about this one
			return ;
		}
		sendMessage(JSON.stringify({ type: 'send_message', conversationID: conversationID, content: content, }))
		setContent('');
		setCharCount(0);
	};

	const handleInputChange = (e) => {
		setContent(e.target.value);
		setCharCount(e.target.value.length);
	};

	return (
		<>
			<DirectMessageContainer $isOpen={isOpen} $isMinimized={isMinimized}>
				<Header onClick={toggleMinimization}>
					<ProfilePicture src={otherUser.avatarID} alt={`${otherUser.username}'s profile picture`} $header />
					<OnlineStatus $status={otherUser.status?.online || false} />
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
								onChange={handleInputChange}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleMessage();
									}
								}}
								maxLength={256}
								rows={1}
								autoFocus
							/>
							<SendButton onClick={handleMessage} disabled={content.trim() === ''}>
								<i className="bi bi-send-fill" />
							</SendButton>
							<span style={{
								position: 'absolute',
								bottom: '12px',
								right: '60px',
								fontSize: '7px',
								color: 'rgba(255, 255, 255, 0.5)'
							}}>
								{charCount}/256
							</span>
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
