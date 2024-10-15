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
	const [unreadMessages, setUnreadMessages] = useState(0);
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});

	// useEffect(() => {
	// 	if (!conversations) return;

	// 	const unread =

	// 	setUnreadMessages(unread);
	// });

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

	return (
		<ChatProvider conversations={conversations} friends={friends} blockedUsers={blockedUsers}>
			<ChatContainer>
				<MainChatContainer $isMinimized={isOverlayMinimized}>
					<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
					{/* {totalUnreadMessages > 0 && <NotificationBadge count={totalUnreadMessages} />} */}
					{!isOverlayMinimized && (
						<>
							<SearchFriends toggleMinimization={mainMinimizer} handleSelectChat={handleSelectChat}/>
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
