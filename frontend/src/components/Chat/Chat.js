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
	const [DMWinArrow, setDMWinArrow] = useState(false);
	const [mainWinArrow, setMainWinArrow] = useState(false);
	const [focusedConvID, setFocusedConvID] = useState(null);

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

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader toggleMinimization={mainMinimizer} arrowState={mainWinArrow} />
				{!isOverlayMinimized && (
					<>
						<SearchFriends/>
						<MessagePreview
							conversationsData={conversations}
							setFocusedConvID={setFocusedConvID}
							handleSelectChat={handleSelectChat}
						/>
					</>
				)}
			</MainChatContainer>
			{DMWindow && (
				<DirectMessage
					conversationID={focusedConvID}
					conversations={conversations}
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
