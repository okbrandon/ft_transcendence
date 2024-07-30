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
		<header className='msg-window-header'>
			<div className='msg-window-container'>
				<div className='msg-window-details'>
					<div className='msg-avatar'>
						{/* img avatar profile */}
					</div>
					<button className='msg-username'>
						<span>Messages</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Chat;