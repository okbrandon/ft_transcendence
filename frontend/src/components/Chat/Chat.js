import React, { useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import { useRelation } from '../../context/RelationContext.js';
import ChatHeader from './tools/ChatHeader.js';
import { ChatProvider } from '../../context/ChatContext.js';

const Chat = () => {
	const { conversations, blockedUsers, relations, friends } = useRelation();
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [mainWinArrow, setMainWinArrow] = useState(false);
	const [directMessage, setDirectMessage] = useState({
		isOpen: false,
		isMinimized: false,
		username: null,
		conversationID: null,
	});

	// log a separate in the console

	console.log('-----------------------------');
	console.log('In Chat relations: ', relations); // Do I need this?
	console.log('In Chat friends: ', friends);
	console.log('In Chat blockedUsers: ', blockedUsers);
	console.log('In Chat conversations: ', conversations);

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
		<ChatProvider conversations={conversations} friends={friends} blockedUsers={blockedUsers}>
			<ChatContainer>
				<MainChatContainer $isMinimized={isOverlayMinimized}>
					<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
					{!isOverlayMinimized && (
						<>
							<SearchFriends conversations={conversations} />
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
