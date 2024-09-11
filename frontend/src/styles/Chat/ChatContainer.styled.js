import styled from "styled-components";

const ChatContainer = styled.div`
	width: 100%;
	position: fixed;
	z-index: 9000;
	bottom: 0;
	left: 0;
	pointer-events: none;
	display: flex;
	flex-wrap: nowrap;
	justify-content: flex-start;
`;

export default ChatContainer;
