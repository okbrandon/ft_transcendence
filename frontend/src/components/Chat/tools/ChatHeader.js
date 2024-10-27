import React from 'react';
import Arrow from './Arrow.js';
import { ChatNotificationPopUp, Header } from '../styles/Chat/ChatContainer.styled.js'
import { useChat } from '../../../context/ChatContext.js';

const ChatHeader = ({ toggleMinimization, arrowState }) => {
	const { unreadCounts } = useChat();
	const unreadCount = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);

	return (
		<Header onClick={toggleMinimization}>
			{unreadCount > 0 && <ChatNotificationPopUp>{unreadCount}</ChatNotificationPopUp>}
			Messages
			<Arrow ArrowAnimate={arrowState} />
		</Header>
	);
};

export default ChatHeader;
