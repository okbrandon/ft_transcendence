import React, { useContext, useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { DirectMessage } from './DirectMessage.js';
import { Arrow } from './tools/Arrow.js';
import ChatContainer, { ChatHeaderStyled, ChatListFeatures } from './styles/Chat/ChatContainer.styled.js';
import ScrollableComponent from './tools/ScrollableComponent.js';
import { ChatContext } from '../../context/ChatContext.js';

const Chat = () => {
	const { conversations } = useContext(ChatContext);

	console.log('Chat; conversations: ', conversations);
	// log conversation id
	console.log('Chat: conversationID: ', conversations.map(conversation => conversation.conversationID));
	console.log('Chat: lastMessage: ', conversations.map(conversation => conversation.messages[conversation.messages.length - 1]));

	// store in var number of conversationID user has
	const total = conversations.length;

	console.log('Chat: total: ', total);

	const [openChats, setOpenChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [$isMinimized, setIsMinimized] = useState(true);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
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
			<ChatListFeatures $isMinimized={isOverlayMinimized}>
				<ChatHeaderStyled onClick={handleToggleOverlayMinimize}>
					Messaging
					<Arrow
						onClick={handleToggleOverlayMinimize}
						ArrowAnimate={isArrowActive}
					/>
				</ChatHeaderStyled>
				{!isOverlayMinimized && (
					<>
						<SearchFriends onOpenChat={handleSelectFriend} />
						<ScrollableComponent>
							{/* Handle click event for opening the correct window for dm */}
							<MessagePreview conversationsData={conversations} onSelectChat={handleSelectChat} />
						</ScrollableComponent>
					</>
				)}
			</ChatListFeatures>
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
