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
	padding: 10px;
	background-color: #000;
	// border: 1px solid #ddd;
	font-weight: bold;
	color: #fff;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	border-radius: 10px 10px 0 0;
`;

export const MainChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3%;
	height: ${({ $isMinimized }) => ($isMinimized ? '45px' : 'calc(100vh - 250px)')};
	flex: 0 0 288px;
	width: 288px;
	min-width: 0;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 10px 10px 0 0;
	transition: height 0.3s ease;
`;


export default ChatContainer;
