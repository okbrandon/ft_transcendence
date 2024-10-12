import React, { useState, useEffect } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import { useRelation } from '../../context/RelationContext.js';
import ChatHeader from './tools/ChatHeader.js';
import { ChatProvider } from '../../context/ChatContext.js';
import NotificationBadge from './tools/NotificationBadge.js';

const Chat = () => {
	const { conversations, blockedUsers, friends } = useRelation();
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [mainWinArrow, setMainWinArrow] = useState(false);
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});
	const [unreadMessages, setUnreadMessages] = useState({});
	const [readConversations, setReadConversations] = useState(
		JSON.parse(localStorage.getItem('readConversations')) || {}
	);
	const userID = localStorage.getItem('userID');

	const handleSelectChat = (username, conversationID) => {
		setDirectMessage({
			isOpen: true,
			isMinimized: false,
			username,
			conversationID,
		});

		setReadConversations((prev) => {
			const updatedReadConversations = {
				...prev,
				[conversationID]: true,
			};
			localStorage.setItem('readConversations', JSON.stringify(updatedReadConversations));
			return updatedReadConversations;
		});

		setUnreadMessages((prev) => ({
			...prev,
			[conversationID]: 0,
		}));
	};

	const handleCloseChat = () => {
		setDirectMessage({
			isOpen: false,
			isMinimized: false,
			username: null,
			conversationID: null,
		});
	};

	const toggleDMMinimization = () => {
		setDirectMessage((prev) => ({
			...prev,
			isOpen: true,
			isMinimized: !prev.isMinimized,
		}));
	};

	const mainMinimizer = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setMainWinArrow(!mainWinArrow);
	};

	useEffect(() => {
		const updatedUnreadMessages = conversations.reduce((acc, convo) => {
			const messages = convo.messages;
			if (messages && messages.length > 0) {
				const lastMessage = messages[messages.length - 1];

				const isReceiver = lastMessage.sender.userID !== userID;
				const isConversationRead = !!readConversations[convo.conversationID];

				if (isReceiver && !isConversationRead) {
					acc[convo.conversationID] = (acc[convo.conversationID] || 0) + 1;
				} else {
					acc[convo.conversationID] = 0;
				}
			} else {
				acc[convo.conversationID] = 0;
			}

			return acc;
		}, {});

		setUnreadMessages(updatedUnreadMessages);
	}, [conversations, userID, readConversations]);

	const totalUnreadMessages = Object.values(unreadMessages).reduce(
		(acc, count) => acc + count,
		0
	);

	return (
		<ChatProvider conversations={conversations} friends={friends} blockedUsers={blockedUsers}>
			<ChatContainer>
				<MainChatContainer $isMinimized={isOverlayMinimized}>
					<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
					{totalUnreadMessages > 0 && <NotificationBadge count={totalUnreadMessages} />}
					{!isOverlayMinimized && (
						<>
							<SearchFriends handleSelectChat={handleSelectChat}/>
							<MessagePreview handleSelectChat={handleSelectChat} />
						</>
					)}
				</MainChatContainer>
				{directMessage.username && (
					<DirectMessage
						{...directMessage}
						conversations={conversations}
						onClose={handleCloseChat}
						toggleMinimization={toggleDMMinimization}
					/>
				)}
			</ChatContainer>
		</ChatProvider>
	);
};

export default Chat;
