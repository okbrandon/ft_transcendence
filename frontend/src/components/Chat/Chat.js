import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { ChatWindow } from './ChatWindow.js';
import { Arrow } from './Arrow.js';
import ChatContainer from '../../styles/Chat/ChatContainer.styled';

const ChatOverlayContainer = styled.aside`
	height: ${({ isMinimized }) => (isMinimized ? '45px' : 'auto')};
	pointer-events: auto;
	overflow: visible;
	display: flex;
	flex-direction: row-reverse;
	flex-wrap: nowrap;
	align-items: flex-end;
	flex: 1;
	position: relative;
	transition: height 0.3s ease;
`;

const ChatListBubble = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3%;
	height: ${({ isMinimized }) => (isMinimized ? '45px' : 'calc(100vh - 100px)')};
	flex: 0 0 288px;
	width: 288px;
	min-width: 0;
	background-color: #fff;
	border: 1px solid #ddd;
	transition: height 0.3s ease;
`;

const ChatHeaderStyled = styled.div`
	padding: 10px;
	background-color: #000;
	border: 1px solid #ddd;
	font-weight: bold;
	color: #fff;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`;

const Chat = () => {
	const [openChats, setOpenChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);
	const [isArrowActive, setIsArrowActive] = useState(false);
	const [messages, setMessages] = useState({
		'Alice': { sender: 'Alice', text: 'Hello!' },
		'Bob': { sender: 'Bob', text: 'Hi there!' },
		'Brandonation': { sender: 'Brandonation', text: 'Good morning!' },
		'Evanescence': { sender: 'Evanescence', text: 'How are you?' },
		'Hanministrateur': { sender: 'Hanministrateur', text: 'Let\'s meet up.' },
		'Kianatomy': { sender: 'Kianatomy', text: 'See you soon!' }
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
		setIsMinimized(!isMinimized);
	}
	
	const handleToggleOverlayMinimize = () => {
		setIsOverlayMinimized(!isOverlayMinimized);
		setIsArrowActive(!isArrowActive);
	}

	return (
		<ChatContainer>
			<ChatOverlayContainer isMinimized={isOverlayMinimized}>
				<ChatListBubble isMinimized={isOverlayMinimized}>
					<ChatHeaderStyled onClick={handleToggleOverlayMinimize}>
						Messaging
						<Arrow
							onClick={handleToggleOverlayMinimize}
							ArrowAnimate={isArrowActive} />
					</ChatHeaderStyled>
					{!isOverlayMinimized && (
						<>
							<SearchFriends onOpenChat={openChat} />
							{Object.keys(messages).map(friend => (
								<MessagePreview key={friend} messages={[messages[friend]]} onClick={() => handleSelectChat(friend)} />
							))}
						</>
					)}
				</ChatListBubble>
				{selectedChat && (
					<ChatWindow
						friendname={selectedChat}
						messages={messages[selectedChat]}
						onClose={handleCloseChat}
						isMinimized={isMinimized}
						onToggleMinimize={handleToggleMinimize}
					/>
				)}
			</ChatOverlayContainer>
		</ChatContainer>
	);
};

export default Chat;
