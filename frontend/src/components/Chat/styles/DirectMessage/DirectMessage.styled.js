import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
	0% { transform: scale(0.8); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`;

const DirectMessageContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative !important;
	margin-right: 1%;
	max-width: 320px;
	height: ${({ $isOpen, $isMinimized }) => $isOpen ? ($isMinimized ? '45px' : '500px') : '45px'};
	transition: height 0.3s ease;
	border: 1px solid #ddd;
	border-radius: 10px 10px 0 0;
	z-index: 1; /* Ensure the content is above the pseudo-element */

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(10px);
		border-radius: 10px 10px 0 0;
		z-index: -1;
	}
`;

export const Username = styled.span`
	cursor: pointer;
	index: 1000;
	transition: all 0.3s ease;

	&:hover {
		text-decoration: underline;
	}

	&:active {
		color: #6a0dad;
	}
`;

export const Dropdown = styled.div`
	position: absolute;
	width: 70%;
	top: 100%;
	left: 50%; /* Center horizontally */
	transform: translateX(-50%); /* Center horizontally */
	border-radius: 0 0 5px 5px;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
	z-index: 1000;
`;

export const DropdownItem = styled.button`
	display: block;
	width: 100%;
	padding: 10px;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;
	font-size: 0.9rem;
	background-color: rgba(255, 255, 255, 0.7);

	&[data-action="profile"] {
		&:hover {
			background-color: #6a0dad;
			color: #fff;
			font-weight: bold;
		}
	}
	&[data-action="invite"] {
		&:hover {
			background-color: #9AE66E;
			color: #fff;
			font-weight: bold;
		}
	}
	&[data-action="block"] {
		border-radius: 0 0 5px 5px;

		&:hover {
			background-color: #EE4266;
			color: #fff;
			font-weight: bold;
		}
	}
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

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: #f5f5f5;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #6a0dad;
		border-radius: 4px;
		border: 2px solid #f5f5f5;
	}
`;

export const ChatInputContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: rgba(255, 255, 255, 0.1);
	border-top: 1px solid #ddd;
	display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
	transition: all 0.3s ease;
`;

export const ChatInput = styled.input`
	flex: 1;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	margin-right: 10px;
	width: 100%;
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

const BaseBubble = styled.div`
	padding: 10px;
	margin: 5px;
	max-width: calc(100% - 60px);
	word-wrap: break-word;
	white-space: pre-wrap;
	font-family: 'Arial', sans-serif;
	font-size: 14px;
	line-height: 1.4;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	animation: popIn 0.3s ease-out;
	role: log;
	aria-live: polite;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	&::after {
		content: attr(data-time);
		display: block;
		font-size: 0.8em;
		margin-top: 5px;
		opacity: 0.7;
	}

	@keyframes popIn {
		0% { transform: scale(0.8); opacity: 0; }
		100% { transform: scale(1); opacity: 1; }
	}
`;

export const SenderBubble = styled(BaseBubble)`
	background-color: #6a0dad;
	color: #fff;
	border-radius: 10px 10px 0 10px;
	margin-left: auto;
	align-self: flex-end;
`;

export const HostBubble = styled(BaseBubble)`
	background-color: #E8E2E2;
	color: #333;
	border-radius: 10px 10px 10px 0;
	margin-right: auto;
	align-self: flex-start;
`;

export default DirectMessageContainer;
