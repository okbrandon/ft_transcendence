import React from 'react';
import styled from 'styled-components';

const ChatWindowContainer = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const ChatInputContainer = styled.div`
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ChatWindow = ({ friendname, messages }) => {
  return (
	<ChatWindowContainer>
	  <ChatHeader>{friendname}</ChatHeader>
	  <ChatMessages>
		<div>{messages.text}</div>
	  </ChatMessages>
	  <ChatInputContainer>
		<ChatInput placeholder="Type a message..." />
	  </ChatInputContainer>
	</ChatWindowContainer>
  );
};

export default ChatWindow;