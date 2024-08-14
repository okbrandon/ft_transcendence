import React from 'react';
import styled from 'styled-components';

const ChatHeaderStyle = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 .8rem 0 0;
  min-height: 48px;
  position: relative;
  background-color: black;
  border: 1px solid white;
`;

const MessageButtonContainer = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: .4rem;
  padding: .4rem;
  position: relative;
  flex-grow: 1;
  height: 100%;
  cursor: pointer
`;

const MessageButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  max-width: 230px;
  margin-left: .4rem;
`;

const MessageText = styled.span`
  color: white;
  letter-spacing: .1rem;
  text-transform: uppercase;
  font-weight: bold;
`;

export const ChatHeader = () => {
  return (
    <ChatHeaderStyle>
      <MessageButtonContainer>
        <MessageButton>
          <MessageText>Messages</MessageText>
        </MessageButton>
      </MessageButtonContainer>
    </ChatHeaderStyle>
  );
};
