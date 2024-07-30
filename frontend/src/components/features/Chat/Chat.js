import React, { useState } from 'react';
import {
	ChatContainer,
	ChatHeader,
	UsernameButton,
	ChatBody,
	MessageItem,
	ChatFooter,
	InputGroup,
	InputField,
	SendButton
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
					<MessageItem key={index}>
						{msg}
					</MessageItem>
				))}
			</ChatBody>
			<ChatFooter>
				<InputGroup>
					<InputField
						type="text"
						value="{input}"
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type text here..."
					/>
					<SendButton onClick={handleSend}>
						Send
					</SendButton>
				</InputGroup>
			</ChatFooter>
		</ChatContainer>
	);
};

export default Chat;
