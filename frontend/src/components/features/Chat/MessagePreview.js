import React from 'react';
import styled from 'styled-components';
import defaultAvatar from './img/default-avatar.jpg';

const PreviewContainer = styled.div`
  padding: 10px;
  border-top: 1px solid #ddd;
  color: #333;
  display: flex;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Sender = styled.strong`
  font-size: 1.1rem;
`;

const MessageText = styled.span`
  opacity: 0.5;
`;

export const MessagePreview = ({ messages }) => {
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
	<PreviewContainer>
      {lastMessage ? (
        <>
          <ProfilePicture src={defaultAvatar} alt={`${lastMessage.sender}'s profile`} />
          <MessageContent>
            <Sender>{lastMessage.sender}</Sender>
            <MessageText>{lastMessage.text}</MessageText>
          </MessageContent>
        </>
      ) : (
        <div>No messages to display</div>
      )}
    </PreviewContainer>
  );
};
