import React, { useEffect, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import { useRelation } from '../../context/RelationContext.js';
import ChatHeader from './tools/ChatHeader.js';
import { useChat } from '../../context/ChatContext.js';

const Chat = () => {
	const { relations } = useRelation();
	const { directMessage, setDirectMessage, handleSelectChat } = useChat();
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [mainWinArrow, setMainWinArrow] = useState(false);

	const toggleDMMinimization = () => {
		setDirectMessage(prev => ({
			...prev,
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
	}, [relations, handleSelectChat]);

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
				{!isOverlayMinimized && (
					<>
						<SearchFriends toggleMinimization={mainMinimizer}/>
						<MessagePreview/>
					</>
				)}
			</MainChatContainer>
			{directMessage.username && (
				<DirectMessage
					{...directMessage}
					toggleMinimization={toggleDMMinimization}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
