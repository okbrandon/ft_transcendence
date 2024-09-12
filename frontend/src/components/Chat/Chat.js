import React, { useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { ChatWindow } from './ChatWindow.js';
import { Arrow } from './Arrow.js';
import ChatContainer, { ChatHeaderStyled, ChatListFeatures } from './styles/ChatContainer.styled';

const Chat = () => {
	const [openChats, setOpenChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [$isMinimized, setIsMinimized] = useState(true);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(true);
	const [isArrowActive, setIsArrowActive] = useState(true);
	const [messages, setMessages] = useState({
		'Alice': { sender: 'Alice', text: 'Hello!' },
		'Bob': { sender: 'Bob', text: 'Hi there!' },
		'Brandonation': { sender: 'Brandonation', text: 'Good morning!' },
		'Evanescence': { sender: 'Evanescence', text: 'How are you?' },
		'Hanministrateur': { sender: 'Hanministrateur', text: 'Let\'s meet up.' },
		'Kianatomy': { sender: 'Kianatomy', text: 'See you soon!' },'Kianatom': { sender: 'Kianatomy', text: 'See you soon!' },'Kiaatomy': { sender: 'Kianatomy', text: 'See you soon!' },'Kianatomy': { sender: 'Kianatomy', text: 'See you soon!' },'Kianatomy': { sender: 'Kianatomy', text: 'See you soon!' },'Kianatomy': { sender: 'Kianaomy', text: 'See you soon!' },'Kianatomy': { sender: 'Kiantomy', text: 'See you soon!' },'Kiaatomy': { sender: 'Kianatomy', text: 'See you soon!' },'ianatomy': { sender: 'Kianatomy', text: 'See you soon!' }
	});

	const openChat = (friendname) => {
		if (!openChats.includes(friendname)) {
			setOpenChats([...openChats, friendname]);
		}
	};

	const handleSelectChat = (friendname) => {
		setSelectedChat(friendname);
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
						{Object.keys(messages).map(friend => (
							<MessagePreview key={friend} messages={[messages[friend]]} onClick={() => handleSelectChat(friend)} />
						))}
					</>
				)}
			</ChatListFeatures>
			{selectedChat && (
				<ChatWindow
					friendname={selectedChat}
					messages={messages[selectedChat]}
					onClose={handleCloseChat}
					$isMinimized={$isMinimized}
					onToggleMinimize={handleToggleMinimize}
				/>
			)}
		</ChatContainer>
	);
};

export default Chat;
