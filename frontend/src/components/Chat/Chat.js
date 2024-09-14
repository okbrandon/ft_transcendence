import React, { useState } from 'react';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { ChatWindow } from './ChatWindow.js';
import { Arrow } from './Arrow.js';
import ChatContainer, { ChatHeaderStyled, ChatListFeatures } from './styles/ChatContainer.styled';
import ScrollableComponent from './ScrollableComponent.js';

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
		'Kianatomy': { sender: 'Kianatomy', text: 'I\'m busy.' },
		'Robert': { sender: 'Robert', text: 'Cringe.' },
		'John': { sender: 'John', text: 'I\'m tired.' },
		'Jane': { sender: 'Jane', text: 'I\'m hungry.' },
		'Alex': { sender: 'Alex', text: 'I\'m sleepy.' },
		'Charlie': { sender: 'Charlie', text: 'I\'m bored.' },
		'Daniel': { sender: 'Daniel', text: 'I\'m sick.' },
		'Emily': { sender: 'Emily', text: 'I\'m sad.' },
		'Frank': { sender: 'Frank', text: 'I\'m happy.' },
		'Grace': { sender: 'Grace', text: 'I\'m excited.' },
		'Henry': { sender: 'Henry', text: 'I\'m anxious.' },
		'Ivy': { sender: 'Ivy', text: 'I\'m nervous.' },
		'Jack': { sender: 'Jack', text: 'I\'m stressed.' },
		'Kevin': { sender: 'Kevin', text: 'I\'m overwhelmed.' },
		'Lucy': { sender: 'Lucy', text: 'I\'m frustrated.' },
		'Mary': { sender: 'Mary', text: 'I\'m angry.' },
		'Nathan': { sender: 'Nathan', text: 'I\'m confused.' },
		'Oliver': { sender: 'Oliver', text: 'I\'m lost.' },
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
						<ScrollableComponent>
							{Object.keys(messages).map(friend => (
								<MessagePreview key={friend} messages={[messages[friend]]} onClick={() => handleSelectChat(friend)} />
							))}
						</ScrollableComponent>
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
