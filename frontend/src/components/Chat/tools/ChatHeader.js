import React from 'react';
import Arrow from './Arrow.js';
import { ChatNotificationPopUp, Header } from '../styles/Chat/ChatContainer.styled.js'
import { useChat } from '../../../context/ChatContext.js';
import { useTranslation } from 'react-i18next';

const ChatHeader = ({ toggleMinimization, arrowState }) => {
	const { unreadCounts } = useChat();
	const unreadCount = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
	const { t } = useTranslation();

	return (
		<Header onClick={toggleMinimization}>
			{unreadCount > 0 && <ChatNotificationPopUp>{unreadCount}</ChatNotificationPopUp>}
			{t('chat.message.title')}
			<Arrow ArrowAnimate={arrowState} />
		</Header>
	);
};

export default ChatHeader;
