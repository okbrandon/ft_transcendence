import styled from 'styled-components';

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
		background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent background */
		backdrop-filter: blur(10px); /* Blur effect */
		border-radius: 10px 10px 0 0;
		z-index: -1; /* Ensure the pseudo-element is behind the content */
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
	width: 40%;
	top: 100%;
	left: 0;
	background-color: black;
	border-radius: 0 0 5px 0;
	box-shadow: 0 2px 5px rgba(0,0,0,0.1);
	display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
	z-index: 1000;
`;

export const DropdownItem = styled.button`
	display: block;
	width: 100%;
	padding: 10px;
	text-align: left;
	background: none;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;
	font-size: 0.9rem;
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
		border-radius: 0 0 5px 0;

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

export const SenderBubble = styled.div`
	background-color: #6a0dad;
	color: #fff;
	border-radius: 10px 10px 0 10px;
	padding: 10px;
	margin: 5px 5px 5px auto;
	max-width: 70%;
	align-self: flex-end;
	word-wrap: break-word;
	white-space: pre-wrap;
`;

export const HostBubble = styled.div`
	background-color: #E8E2E2;
	color: #333;
	border-radius: 10px 10px 10px 0;
	padding: 10px;
	margin: 5px auto 5px 5px;
	max-width: 70%;
	align-self: flex-start;
	word-wrap: break-word;
	white-space: pre-wrap;
`;

export default DirectMessageContainer;
