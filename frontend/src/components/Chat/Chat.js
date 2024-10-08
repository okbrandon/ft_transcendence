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
	const [convoObject, setConvoObject] = useState(null);
	const [DMWinArrow, setDMWinArrow] = useState(false);
	const [mainWinArrow, setMainWinArrow] = useState(false);

	const handleSelectChat = (username) => {
		setDMWindow(username);
	}

	const handleCloseChat = () => {
		setDMWindow(null);
	}

	const DMWinMinimizer = () => {
		setIsMinimized(!$isMinimized);
		setDMWinArrow(!DMWinArrow);
	}

	const mainMinimizer = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setMainWinArrow(!mainWinArrow);
	}

	const handleSelectFriend = (convo) => {
		console.log('Selected conversation: ', convo);

		let userName = convo.messages.map((message) => message.sender.username);
		let userNameFromLastMessage = userName[userName.length - 1];
		console.log('Username', userName);
		setConvoObject(convo);
		handleSelectChat(userNameFromLastMessage);
	};

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
				{!isOverlayMinimized && (
					<>
						<SearchFriends onOpenChat={handleSelectFriend} />
						<ScrollableComponent>
							<MessagePreview conversationsData={conversations} onSelectChat={handleSelectFriend} />
						</ScrollableComponent>
					</>
				)}
			</MainChatContainer>
			{DMWindow && (
				<DirectMessage
					convo={convoObject}
					username={DMWindow}
					onClose={handleCloseChat}
					$isMinimized={$isMinimized}
					toggleMinimization={DMWinMinimizer}
					arrowState={DMWinArrow}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
