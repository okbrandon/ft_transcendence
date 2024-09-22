import styled from "styled-components";

export const ListContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(1, minmax(250px, 1fr));
	gap: 1.5rem;
	margin-top: 2rem;
`;

export const FriendCard = styled.div`
	background: rgba(26, 26, 26, 0.5);
	padding: 1.5rem;
	border-radius: 15px;
	box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 30px rgba(255, 255, 255, 0.15), 0px 0px 20px rgba(164, 69, 178, 0.2);
	}
`;

export const FriendInfo = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
`;

export const FriendAvatar = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
	object-fit: cover;
	border: 2px solid rgba(255, 255, 255, 0.2);
`;

export const FriendStatus = styled.span`
	width: 12px;
	height: 12px;
	background: ${({ $status }) => $status === "online" ? "#00ff88" : "#ff5555"};
	border-radius: 50%;
	margin-right: 2rem;
	box-shadow: 0 0 10px ${({ $status }) => ($status === "online" ? "#00ff88" : "#ff5555")};
`;

export const FriendName = styled.h3`
	font-size: 1.3rem;
	font-family: "Roboto", sans-serif;
	padding: 0.5rem 0.5rem;
`;

export const Actions = styled.div`
	display: flex;
	gap: 1rem;
`;
