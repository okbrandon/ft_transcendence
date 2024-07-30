import React, { useState } from 'react';

const Chat = () => {

	const [message, setMessage] = useState('[]'); // message variable used to store the messages
	const [input, setInput] = useState(''); // input variable used to store the input value

	const handleSend = () => {
		// check if input is empty
		if (input === '') {
			return;
		}
		setMessage([...message, input]); // add the input value to the message
		setInput(''); // clear the input value
	}

	return (
		<div className='chat-container border rounded'>
			
		</div>
	);
};

export default Chat;