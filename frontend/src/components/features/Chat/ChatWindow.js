import React from 'react';
import styled from 'styled-components';

const ChatWindowContainer = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  position: relative !important;
  margin-right: 1%;
  max-width: 350px;
  height: 500px;
`;

const ChatHeader = styled.div`
  padding: 10px;
  background-color: #000;
  border: 1px solid #ddd;
  font-weight: bold;
  color: #fff;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: none;
	border: none;
	color: #fff;
	font-size: 16px;
	cursor: pointer;

	&:hover {
		color: #333;
	}
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  color: #333;
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

export const ChatWindow = ({ friendname, messages, onClose }) => {
  return (
	<ChatWindowContainer>
	  <ChatHeader>
		{friendname}
		<CloseButton onClick={onClose}>X</CloseButton>
		</ChatHeader>
	  <ChatMessages>
		<div>{messages.text}</div>
	  </ChatMessages>
	  <ChatInputContainer>
		<ChatInput placeholder="Type a message..." />
	  </ChatInputContainer>
	</ChatWindowContainer>
  );
};
