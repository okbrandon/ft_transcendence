import styled from "styled-components";

export const SearchListContainer = styled.div`
	position: absolute;
	top: 37px;
	width: 100%;
	background-color: rgba(10, 10, 10, 0.95);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	z-index: 1000;
	max-height: 150px;
	overflow-y: auto;
	box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
`;

export const SearchListItem = styled.div`
	display: flex;
	align-items: center;
	padding: 10px 15px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	cursor: pointer;
	transition: all 0.3s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&:last-child {
		border-bottom: none;
	}
`;

export const SearchListItemImage = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 10px;
	border: 2px solid rgba(255, 255, 255, 0.2);
`;

export const SearchListItemText = styled.p`
	color: #ffffff;
	font-size: 1rem;
	margin: 0;
	font-family: "Roboto", sans-serif;
	letter-spacing: 0.5px;
`;
