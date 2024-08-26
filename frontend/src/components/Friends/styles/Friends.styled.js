import styled from 'styled-components';

export const PageContainer = styled.div`
	padding: 2rem;
	background: linear-gradient(135deg, #000 0%, #111 100%);
	color: #fff;
	min-height: 100vh;
	margin-top: 80px;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	width: 80%;
	margin: 0 auto;

	h1 {
		font-family: "Orbitron", sans-serif;
		font-size: 2rem;
	}
`;

export const SearchInput = styled.input`
	padding: 0.8rem 1rem;
	font-size: 1rem;
	border-radius: 8px;
	border: none;
	background: #222;
	color: #fff;
	outline: none;
	transition: all 0.3s ease;

	&:focus {
		background: #333;
		box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.4);
	}
`;

export const FriendsList = styled.div`
	display: grid;
	grid-template-columns: repeat(1, minmax(250px, 1fr));
	gap: 1.5rem;
	width: 80%;
	margin: 5rem auto;
`;

export const FriendCard = styled.div`
	background: #1a1a1a;
	padding: 1.5rem;
	border-radius: 15px;
	box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 8px 30px rgba(255, 255, 255, 0.3), 0px 0px 20px rgba(255, 255, 255, 0.5);
	}
`;

export const FriendInfo = styled.div`
	display: flex;
	align-items: center;
`;

export const FriendStatus = styled.span`
	width: 12px;
	height: 12px;
	background: ${({ status }) => (status === "online" ? "#00ff88" : "#ff5555")};
	border-radius: 50%;
	margin-right: 10px;
`;

export const FriendName = styled.h3`
	font-size: 1.3rem;
	font-family: "Roboto", sans-serif;
	padding: 0.5rem 1rem;
`;

export const Actions = styled.div`
	display: flex;
	gap: 0.8rem;
`;

export const ActionButton = styled.button`
	background: #ffffff;
	color: #101010;
	padding: 0.6rem 1rem;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-size: 0.9rem;

	&:hover {
		background: #f0f0f0;
	}
`;

export const RemoveButton = styled(ActionButton)`
	background: #ff5555;
	color: #fff;

	&:hover {
		background: #ff3333;
	}
`;
