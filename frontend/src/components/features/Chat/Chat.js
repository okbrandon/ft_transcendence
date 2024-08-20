import React, { useState } from 'react';
import styled from 'styled-components';
import { ChatHeader } from './ChatHeader.js';
import { SearchFriends } from './SearchFriends.js';
import { MessagePreview } from './MessagePreview.js';

const OverlayContainer = styled.div`
  width: 100%;
  position: fixed;
  z-index: 9000;
  bottom: 0;
  left: 0;
  pointer-events: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
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
  const [openChats, setOpenChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({
    'Alice': { sender: 'Alice', text: 'Hello!' },
    'Bob': { sender: 'Bob', text: 'Hi there!' },
    'Brandonation': { sender: 'Brandonation', text: 'Good morning!' },
    'Evanescence': { sender: 'Evanescence', text: 'How are you?' },
    'Hanministrateur': { sender: 'Hanministrateur', text: 'Let\'s meet up.' },
    'Kianatomy': { sender: 'Kianatomy', text: 'See you soon!' }
  });

  const openChat = (friendname) => {
    if (!openChats.includes(friendname)) {
      setOpenChats([...openChats, friendname]);
    }
  };

  const handleSelectChat = (friendname) => {
    setSelectedChat(friendname);
  }

  return (
    <OverlayContainer>
      <ChatOverlayContainer>
        {selectedChat && <ChatWindow friendname={selectedChat} messages={messages[selectedChat]} />}
        <ChatListBubble>
          <ChatHeader/>
          <SearchFriends onOpenChat={openChat} />
          {Object.keys(messages).map(friend => (
            <MessagePreview key={friend} messages={[messages[friend]]} onClick={() => handleSelectChat(friend)} />
          ))}
        </ChatListBubble>
      </ChatOverlayContainer>
    </OverlayContainer>
	);
};

export default Chat;
