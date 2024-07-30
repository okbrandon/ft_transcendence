import React, { useState } from 'react';
import {
	ChatContainer,
	ChatHeader,
	UsernameButton,
	ChatBody,
} from '../../styles/chat/Chat.styled'

const Chat = () => {

	const [messages, setMessage] = useState('[]'); // message variable used to store the messages
	const [input, setInput] = useState(''); // input variable used to store the input value

	const handleSend = () => {
		// check if input is empty
		if (input === '') {
			return;
		}
		setMessage([...messages, input]); // add the input value to the message
		setInput(''); // clear the input value
	}

	return (
		<ChatContainer>
			<ChatHeader>
				<UsernameButton>Messages</UsernameButton>
			</ChatHeader>
			<ChatBody>
				{messages.map((msg, index) => (
					
				))}
			</ChatBody>
		</ChatContainer>
	);
};

export default Chat;