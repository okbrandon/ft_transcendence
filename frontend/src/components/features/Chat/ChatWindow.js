import React, { useState } from 'react';
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
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;

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

const Arrow = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  position: relative;
  margin: 0 1rem;
  cursor: pointer;

  span {
    top: 0.5rem;
    position: absolute;
    width: 0.75rem;
    height: 0.1rem;
    background-color: #efefef;
    display: inline-block;
    transition: all 0.2s ease;

    &:first-of-type {
      left: 0;
      transform: rotate(45deg);
    }

    &:last-of-type {
      right: 0;
      transform: rotate(-45deg);
    }
  }

  &.active span {
    &:first-of-type {
      transform: rotate(-45deg);
    }

    &:last-of-type {
      transform: rotate(45deg);
    }
  }
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

export const ChatWindow = ({ friendname, messages, onClose, isMinimized, onToggleMinimize }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    onToggleMinimize();
  };

  return (
    <ChatWindowContainer isMinimized={isMinimized}>
      <ChatHeader>
        {friendname}
        <div>
          <Arrow className={isActive ? 'active' : ''} onClick={handleToggle}>
            <span></span>
            <span></span>
          </Arrow>
          <CloseButton onClick={onClose}>×</CloseButton>
        </div>
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
