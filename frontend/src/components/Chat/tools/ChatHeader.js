import React from 'react';
import Arrow from './Arrow.js';
import { Header } from '../styles/Chat/ChatContainer.styled.js'

const ChatHeader = ({ toggleMinimization, arrowState }) => {
	return (
		<Header onClick={toggleMinimization}>
			Messaging
			<Arrow ArrowAnimate={arrowState} />
		</Header>
	);
};

export default ChatHeader;
