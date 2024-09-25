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
	height: 500px;
	max-height: calc(100% - 100px);
	padding: 10px;
	color: #fff;
	display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
	flex-direction: column;
	overflow-y: auto;
	transition: all 0.3s ease;
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

export const NewConversationMessage = styled.div`
	padding: 20px;
	text-align: center;
	animation: pulse 1s infinite linear;
	background-color: #6a0dad;
	border-radius: 20px;
	font-weight: bold;
	animation-duration: 4s;

	@keyframes pulse {
		0% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.5;
		}
	}

	font-size: 0.9rem;
`;

export const SenderBubble = styled.div`
	background-color: #0084ff;
	color: #fff;
	border-radius: 10px 10px 0 10px;
	padding: 10px;
	margin: 5px 5px 5px auto;
	max-width: 70%;
	align-self: flex-end;
`;

export const HostBubble = styled.div`
	background-color: #E8E2E2;
	color: #333;
	border-radius: 10px 10px 10px 0;
	padding: 10px;
	margin: 5px auto 5px 5px;
	max-width: 70%;
	align-self: flex-start;
`;

export default DirectMessageContainer;
