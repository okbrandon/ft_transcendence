import React from 'react';
import Arrow from './tools/Arrow.js';
import { Header } from './styles/Chat/ChatContainer.styled.js'

const ChatHeader = ({ toggleMinimization, isArrowActive }) => {
	return (
		<Header onClick={toggleMinimization}>
			Messaging
			<Arrow ArrowAnimate={isArrowActive} />
		</Header>
	);
};

export default ChatHeader;
