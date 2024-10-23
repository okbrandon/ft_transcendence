import React, { useEffect, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import { useRelation } from '../../context/RelationContext.js';
import ChatHeader from './tools/ChatHeader.js';
import { ChatProvider } from '../../context/ChatContext.js';

const Chat = () => {
	const {
		conversations,
		blockedUsers,
		friends,
		relations,
		directMessage,
		setDirectMessage,
		handleSelectChat,
		handleCloseChat,
	} = useRelation();
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [mainWinArrow, setMainWinArrow] = useState(false);

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
		if (relations && relations.length > 0) {
			const relation = relations.find((relation) => relation.status === 2);
			if (relation) {
				handleSelectChat(relation.username, null);
			}
		}
	}, [relations]);

	return (
		<ChatProvider conversations={conversations} friends={friends} blockedUsers={blockedUsers}>
			<ChatContainer>
				<MainChatContainer $isMinimized={isOverlayMinimized}>
					<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
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
