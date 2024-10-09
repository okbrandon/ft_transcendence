import React, { useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import ScrollableComponent from './tools/ScrollableComponent.js';
import { useRelation } from '../../context/RelationContext.js';
import ChatHeader from './ChatHeader.js';

const Chat = () => {
	const { conversations } = useRelation();
	const [DMWindow, setDMWindow] = useState(null);
	const [$isMinimized, setIsMinimized] = useState(true);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [mainWinArrow, setMainWinArrow] = useState(false);

	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});

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

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
				{!isOverlayMinimized && (
					<>
						<SearchFriends/>
						<MessagePreview conversationsData={conversations} handleSelectChat={handleSelectChat} />
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
	);
};

export default Chat;
