import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
	0% { transform: scale(0.8); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`;

export const DirectMessageContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative !important;
	margin-right: 1%;
	max-width: 350px;
	height: ${({ $isOpen, $isMinimized }) => $isOpen ? ($isMinimized ? '70px' : '500px') : '45px'};
	transition: height 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px 10px 0 0;
	background-color: rgba(28, 28, 40, 0.9);

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 10px 10px 0 0;
		z-index: -1;
	}
`;


export const Username = styled.span`
	cursor: pointer;
	z-index: 1000;
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
	background-color: #1e1e28;
	color: #fff;

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

	&::-webkit-scrollbar-thumb {
		background-color: #6a0dad;
		border-radius: 4px;
	}
`;

export const ChatInputContainer = styled.div`
	display: ${({ $isMinimized }) => ($isMinimized ? 'none' : 'flex')};
	align-items: center;
	padding: 10px;
	background-color: #1e1e28;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	transition: all 0.3s ease;
`;

export const ChatInput = styled.input`
	flex: 1;
	padding: 10px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
	margin-right: 10px;
	background-color: #2a2a37;
	color: #fff;
	font-size: 1rem;
	resize: none;
	overflow: hidden;

	&::placeholder {
		color: #aaa;
	}

	&:focus {
		background-color: #333344;
		outline: none;
	}
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

export const ChatBubbleContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px 0;
	gap: 0;
`;

export const MessageWrapper = styled.div`
	display: flex;
	justify-content: ${({ $isHost }) => ($isHost ? 'flex-end' : 'flex-start')};
`;

export const BubbleDetails = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const BaseBubble = styled.div`
	padding: 10px 15px;
	margin: 5px;
	max-width: calc(100% - 60px);
	word-wrap: break-word;
	white-space: pre-wrap;
	font-family: 'Helvetica Neue', sans-serif;
	font-size: 14px;
	line-height: 1.4;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	animation: ${popIn} 0.3s ease-out;

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

export const HostBubble = styled(BaseBubble)`
	background-color: #6a0dad;
	color: #fff;
	border-radius: ${({ $isRounded }) => $isRounded ? '18px' : '18px 0 18px 18px'};
	align-self: flex-end;
	width: fit-content;
	margin: 2px;
`;

export const SenderBubble = styled(BaseBubble)`
	background-color: #e0e0e0;
	color: #333;
	border-radius: ${({ $isRounded }) => $isRounded ? '18px' : '0 18px 18px 18px'};
	align-self: flex-start;
	width: fit-content;
	margin: 2px;
`;

export const Avatar = styled.img`
	width: 24px;
	height: 24px;
	border-radius: 50%;
	margin-right: 8px;
	vertical-align: middle;
	object-fit: cover;
`;

export const MessageUsername = styled.span`
	font-size: 0.65em;
	font-weight: bold;
	color: ${props => props.$isHost ? '#fff' : '#6a0dad'};
	display: block;
	text-align: ${props => props.$isHost ? 'left' : 'right'};
	margin: 5px 0;
`;

export default DirectMessageContainer;
