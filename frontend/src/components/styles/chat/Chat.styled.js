import styled from 'styled-components';

// Container for chat window
export const ChatContainer = styled.div`
	width: 300px;
	height: 400px;
	display: flex;
	flex-direction: column;
	border: 1px solid #ddd;
	border-radius: 8px;
`;

// Header
export const ChatHeader = styled.div`
	padding: 8px;
	display: flex;
	align-items: center;
`;

// Avatar
// export const Avatar = styled.div`
// 	margin-right: 8px;
// `;

export const UsernameButton = styled.button`
	background: none;
	border: none;
	font-size: 16px;
	cursor: pointer;
`;

export const ChatBody = styled.div`
	flex-grow: 1;
	padding: 16px;
	overflow-y: auto;
`;

// Individual message item
export const MessageItem = styled.div`
	margin-bottom: 8px;
	padding: 8px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background-color: #f1f1f1;
`;

// Footer of the chat window
export const ChatFooter = styled.footer`
	padding: 8px;
	border-top: 1px solid #ddd;
`;

// Input group for the message input and send button
export const InputGroup = styled.div`
	display: flex;
`;

// Input field for the message
export const InputField = styled.input`
	flex-grow: 1;
	padding: 8px;
	border: 1px solid #ddd;
	border-radius: 8px 0 0 8px;
`;

// Send button
export const SendButton = styled.button`
	padding: 8px 16px;
	border: 1px solid #007bff;
	border-radius: 0 8px 8px 0;
	background-color: #007bff;
	color: white;
	cursor: pointer;

	&:hover {
		background-color: #0056b3;
	}
`;
