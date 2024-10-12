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
	const [notificationCount, setNotificationCount] = useState(0);

	const handleSelectChat = (username, conversationID) => {
		setDirectMessage({
			isOpen: true,
			isMinimized: false,
			username,
			conversationID,
		});
	};

	const handleCloseChat = () => {
		setDirectMessage({
			isOpen: false,
			isMinimized: false,
			username: null,
			conversationID: null,
		});
	}

	const toggleDMMinimization = () => {
		setDirectMessage(prev => ({
			...prev,
			isOpen: true,
			isMinimized: !prev.isMinimized,
		}));
	};

	const mainMinimizer = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setMainWinArrow(!mainWinArrow);
	}

	// Update message count when conversations change
	useEffect(() => {
		const totalMessages = conversations.reduce((acc, convo) => acc + convo.messages.length, 0);
		setNotificationCount(totalMessages);
	}, [conversations]);

	return (
		<ChatProvider conversations={conversations} friends={friends} blockedUsers={blockedUsers}>
			<ChatContainer>
				<MainChatContainer $isMinimized={isOverlayMinimized}>
					<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
					{notificationCount > 0 && <NotificationBadge count={notificationCount} />}
					{!isOverlayMinimized && (
						<>
							<SearchFriends />
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
