import styled from "styled-components";

const ChatContainer = styled.div`
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10000;
	bottom: 0;
	left: 0;
	pointer-events: auto;
	overflow: visible;
	display: flex;
	flex-direction: row-reverse;
	flex: 1;
	align-items: flex-end;
	flex-wrap: nowrap;
	justify-content: flex-start;
	transition: height 0.3s ease;
`;

export const Header = styled.div`
	padding: 20px;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	background: #1e1e28;
	border-radius: 10px 10px 0 0;
	color: #fff;
	font-weight: bold;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	position: relative;

	.icon {
		font-size: 1.2rem;
		color: #aaa;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.icon:hover {
		color: #ffffff;
	}

	&:hover {
		background: #29293d;
	}
`;

export const ChatNotificationPopUp = styled.div`
	position: absolute;
	top: 10px;
	left: 115px;
	background: #ff0000;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	font-size: 0.8rem;
	font-weight: 700;
`;

export const MainChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3%;
	width: 350px;
	max-width: 100%;
	min-width: 0;
	position: relative;
	border-radius: 12px;
	transition: height 0.3s ease, width 0.3s ease;

	height: ${({ $isMinimized }) => ($isMinimized ? '65px' : 'calc(100vh - 250px)')};

	max-height: 600px;
	background-color: #18181f;
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
`;

export const MessagePopUp = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	background: #ff0000;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	text-align: center;
	font-size: 0.8rem;
	font-weight: 700;
`;

export default ChatContainer;
