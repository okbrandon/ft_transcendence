import React from 'react';
import styled from 'styled-components';

export const ChatHeaderContainer = styled.div`
	padding: 10px;
	background-color: #000;
	border: 1px solid #ddd;
	font-weight: bold;
	color: #fff;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	border-radius: 10px 10px 0 0;
`;

const ChatHeader = () => {
	return (
		<ChatHeaderContainer onClick={handleToggleOverlayMinimize}>
					Messaging
					<Arrow
						onClick={handleToggleOverlayMinimize}
						ArrowAnimate={isArrowActive}
					/>
		</ChatHeaderContainer>
	);
};

export default ChatHeader;
