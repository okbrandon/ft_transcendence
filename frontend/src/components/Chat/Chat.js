import React, { useContext, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import ChatContainer, { MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import ScrollableComponent from './tools/ScrollableComponent.js';
import { ChatContext } from '../../context/ChatContext.js';
import ChatHeader from './ChatHeader.js';

const Chat = () => {
	const { conversations } = useContext(ChatContext);

	const [DMWindow, setDMWindow] = useState(null);
	const [$isMinimized, setIsMinimized] = useState(true);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [isArrowActive, setIsArrowActive] = useState(true);
	const [convoObject, setConvoObject] = useState(null);

	const handleSelectChat = (username) => {
		setDMWindow(username);
	}

	const handleCloseChat = () => {
		setDMWindow(null);
	}

	const handleToggleMinimize = () => {
		setIsMinimized(!$isMinimized);
	}

	const handleToggleOverlayMinimize = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setIsArrowActive(!isArrowActive);
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
				<ChatHeader toggleMinimization={handleToggleOverlayMinimize} isArrowActive={isArrowActive} />
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
					toggleMinimization={handleToggleMinimize}
					isArrowActive={isArrowActive}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
