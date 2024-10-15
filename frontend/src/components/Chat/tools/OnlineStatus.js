import styled from "styled-components";

export const OnlineStatus = styled.span`
	position: absolute;
	bottom: 20px;
	left: 43px;
	width: 10px;
	height: 10px;
	background: ${({ $status }) => $status === true ? "#00ff88" : "#ff5555"};
	border-radius: 50%;
	box-shadow: 0 0 10px ${({ $status }) => ($status === true ? "#00ff88" : "#ff5555")};
`;
