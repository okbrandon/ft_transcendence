import styled from "styled-components";

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
	align-items: center;
	cursor: pointer;
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

export const Actions = styled.div`
	display: flex;
	gap: 0.8rem;
`;
