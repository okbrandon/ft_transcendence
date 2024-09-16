import styled from 'styled-components';

const DirectMessageContainer = styled.div`
	flex: 1;
	background-color: #f9f9f9;
	display: flex;
	flex-direction: column;
	position: relative !important;
	margin-right: 1%;
	max-width: 320px;
	height: ${({ $isMinimized }) => ($isMinimized ? '45px' : '500px')};
	transition: height 0.3s ease;
	border: 1px solid #ddd;
	border-radius: 10px 10px 0 0;
`;

export const ChatMessages = styled.div`
	flex: 1;
	padding: 10px;
	overflow-y: auto;
	color: #333;
	display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'block')};
	transition: display 0.3s ease;
`;

export const ChatInputContainer = styled.div`
	padding: 10px;
	background-color: #fff;
	border-top: 1px solid #ddd;
	display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'block')};
	transition: display 0.3s ease;
`;

export const ChatInput = styled.input`
	width: 100%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
`;

export const ActionButtonContainer = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
`;

export const SenderBubble = styled.div`
	background-color: #0084ff;
	color: #fff;
	border-radius: 10px;
	padding: 10px;
	margin: 5px;
	max-width: 70%;
`;

export const ReceiverBubble = styled.div`
	background-color: #f1f0f0;
	color: #333;
	border-radius: 10px;
	padding: 10px;
	margin: 5px;
	max-width: 70%;
`;

export default DirectMessageContainer;
