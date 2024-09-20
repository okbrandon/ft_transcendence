import React, { useContext, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import { Arrow } from './tools/Arrow.js';
import ChatContainer, { ChatHeaderStyled, MainChatContainer } from './styles/Chat/ChatContainer.styled.js';
import ScrollableComponent from './tools/ScrollableComponent.js';
import { ChatContext } from '../../context/ChatContext.js';

const Chat = () => {
	const { conversations } = useContext(ChatContext);

	if (process.env.NODE_ENV === 'development') {
		console.log('Chat; conversations: ', conversations);
		console.log('Chat: conversationID: ', conversations.map(convo => convo.conversationID));
		console.log('Chat: lastMessage: ', conversations.map(convo => convo.messages[convo.messages.length - 1]));
	}

	// This is the list of open chats that will be displayed in the DirectMessage component
	const [openChats, setOpenChats] = useState([]);
	// This is the selected chat that will be displayed in the DirectMessage component
	const [selectedChat, setSelectedChat] = useState(null);
	// This is the minimized state of the DirectMessage component
	const [$isMinimized, setIsMinimized] = useState(true);
	// This is the minimized state of the MainChatContainer component
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	// This is the state of the arrow in the MainChatContainer component for toggling the overlay and animation
	const [isArrowActive, setIsArrowActive] = useState(true);

	const openChat = (friendname) => {
		if (!openChats.includes(friendname)) {
			setOpenChats([...openChats, friendname]);
		}
	};

	const handleSelectChat = (username) => {
		setSelectedChat(username);
	}

	const handleCloseChat = () => {
		setSelectedChat(null);
	}

	const handleToggleMinimize = () => {
		setIsMinimized(!$isMinimized);
	}

	const handleToggleOverlayMinimize = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setIsArrowActive(!isArrowActive);
	}

	const handleSelectFriend = (friendname) => {
		openChat(friendname);
		handleSelectChat(friendname);
	};

	return (
		<ChatContainer>
			<MainChatContainer $isMinimized={isOverlayMinimized}>
				<ChatHeader onClick={handleToggleMinimize}/>
				{!isOverlayMinimized && (
					<>
						<SearchFriends onOpenChat={handleSelectFriend} />
						<ScrollableComponent>
							{/* Handle click event for opening the correct window for dm */}
							<MessagePreview conversationsData={conversations} onSelectChat={handleSelectChat} />
						</ScrollableComponent>
					</>
				)}
			</MainChatContainer>
			{selectedChat && (
				<DirectMessage
					selectedChatID={selectedChat}
					conversationsData={conversations}
					onClose={handleCloseChat}
					$isMinimized={$isMinimized}
					onToggleMinimize={handleToggleMinimize}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
