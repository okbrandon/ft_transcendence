import React from 'react';
import styled from 'styled-components'
import { ChatHeader } from './ChatHeader.js'

const OverlayContainer = styled.div`
  width: 100%;
  position: fixed;
  z-index: 9000;
  bottom: 0;
  left: 0;
  pointer-events: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
`;

const ChatOverlayContainer = styled.aside`
  height: 0;
  pointer-events: auto;
  overflow: visible;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  align-items: flex-end;
  flex: 1
`;

const ChatListBubble = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  flex: 0 0 288px;
  width: 288px;
  min-width: 0;
  background-color: #fff;
`;

const Chat = () => {
	return (
    <OverlayContainer>
      <ChatOverlayContainer>
        <ChatListBubble>
          <ChatHeader/>
        </ChatListBubble>
      </ChatOverlayContainer>
    </OverlayContainer>
	);
};

export default Chat;
