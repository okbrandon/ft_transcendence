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
  height: ${({ isMinimized }) => (isMinimized ? '40px' : '500px')};
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

const MinimizeButton = styled.button`
	background: none;
	border: none;
	color: #fff;
	font-size: 16px;
	cursor: pointer;
	margin-right: 10px;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  color: #333;
  display: ${({ isMinimized }) => (isMinimized ? 'none' : 'block')};
`;

const ChatInputContainer = styled.div`
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: ${({ isMinimized }) => (isMinimized ? 'none' : 'block')};
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const ChatWindow = ({ friendname, messages, onClose, isMinimized }) => {
  return (
	<ChatWindowContainer isMinimized={isMinimized}>
	  <ChatHeader isMinimized={isMinimized}>
		{friendname}
		<CloseButton onClick={onClose}>X</CloseButton>
		</ChatHeader>
	  <ChatMessages isMinimized={isMinimized}>
		<div>{messages.text}</div>
	  </ChatMessages>
	  <ChatInputContainer isMinimized={isMinimized}>
		<ChatInput placeholder="Type a message..." />
	  </ChatInputContainer>
	</ChatWindowContainer>
  );
};
