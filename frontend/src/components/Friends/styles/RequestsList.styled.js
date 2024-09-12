import styled from "styled-components";

export const RequestsListContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, minmax(250px, 1fr));
	gap: 1.5rem;
	position: relative;
	margin-top: 2rem;
`;

export const RequestCard = styled.div`
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

export const RequestInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-right: 20px;
`;

export const RequestProfile = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const RequestAvatar = styled.img`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	margin-right: 20px;
	object-fit: cover;
	border: 2px solid rgba(255, 255, 255, 0.2);
`;

export const RequestName = styled.h3`
	font-size: 1.3rem;
	font-family: "Roboto", sans-serif;
`;

export const MutualFriends = styled.p`
	font-size: 1rem;
	color: #cccccc;
`;

export const Actions = styled.div`
	display: flex;
	gap: 0.8rem;
`;

export const AcceptButton = styled.button`
	background: #00cc77;
	color: #ffffff;
	padding: 0.6rem 1rem;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 15px rgba(0, 255, 136, 0.4);

	&:hover {
		background: #00ff88;
		box-shadow: 0px 6px 20px rgba(0, 255, 136, 0.6);
	}
`;

export const DeclineButton = styled.button`
	background: #ff5555;
	color: #ffffff;
	padding: 0.6rem 1rem;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 15px rgba(255, 85, 85, 0.4);

	&:hover {
		background: #ff7878;
		box-shadow: 0px 6px 20px rgba(255, 85, 85, 0.6);
	}
`;

export const NoRequests = styled.div`
	position: absolute;
	width: 100%;
	font-size: 1.2rem;
	color: #cccccc;
	text-align: center;
	margin-top: 2rem;
`;
