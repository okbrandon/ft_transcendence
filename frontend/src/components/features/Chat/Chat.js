import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';
import { ChatWindow } from './ChatWindow.js';

const OverlayContainer = styled.div`
	width: 100%;
	position: fixed;
	z-index: 9000;
	bottom: 0;
	left: 0;
	pointer-events: none;
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
`;

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

const Arrow = styled.div`
	width: 1.25rem;
	height: 1.25rem;
	display: inline-block;
	position: relative;
	margin: 0 1rem;
	cursor: pointer;

	span {
		top: 0.5rem;
		position: absolute;
		width: 0.75rem;
		height: 0.1rem;
		background-color: #efefef;
		display: inline-block;
		transition: all 0.2s ease;

		&:first-of-type {
			left: 0;
			transform: rotate(45deg);
		}

		&:last-of-type {
			right: 0;
			transform: rotate(-45deg);
		}
	}

	&.active span {
		&:first-of-type {
			transform: rotate(-45deg);
		}

		&:last-of-type {
			transform: rotate(45deg);
		}
	}
`;

const MinimizeArrowContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Chat = () => {
	const [openChats, setOpenChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [isMinimized, setIsMinimized] = useState(false);
	const [isOverlayMinimized, setIsOverlayMinimized] = useState(false);
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
	}

	return (
		<OverlayContainer>
			<ChatOverlayContainer isMinimized={isOverlayMinimized}>
				<ChatListBubble isMinimized={isOverlayMinimized}>
					<ChatHeaderStyled onClick={handleToggleOverlayMinimize}>
						Messaging
						<MinimizeArrowContainer>
							<Arrow className={isOverlayMinimized ? 'active' : ''} onClick={handleToggleOverlayMinimize}>
								<span></span>
								<span></span>
							</Arrow>
						</MinimizeArrowContainer>
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
		</OverlayContainer>
	);
};

export default Chat;
