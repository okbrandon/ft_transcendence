import styled from "styled-components";

export const SearchListContainer = styled.div`
	position: absolute;
	top: 45px;
	width: 100%;
	background-color: rgba(20, 20, 20, 0.98);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	z-index: 1000;
	max-height: 200px;
	overflow-y: auto;
	box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.6);
	padding: 5px 0;
	transition: max-height 0.3s ease-in-out;

	scrollbar-width: thin;
	scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}
`;

export const SearchListItem = styled.div`
	display: flex;
	align-items: center;
	padding: 12px 18px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	cursor: pointer;
	transition: background-color 0.25s ease, transform 0.25s ease;

	&:hover,
	&.selected {
		background-color: rgba(255, 255, 255, 0.15);
	}

	&:last-child {
		border-bottom: none;
	}
`;

export const SearchListItemImage = styled.img`
	width: 35px;
	height: 35px;
	border-radius: 50%;
	object-fit: cover;
	margin-right: 12px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	transition: border-color 0.3s ease;

	&:hover {
		border-color: rgba(255, 255, 255, 0.6);
	}
`;

export const SearchListItemText = styled.p`
	color: #f0f0f0;
	font-size: 1.1rem;
	margin: 0;
	font-family: "Roboto", sans-serif;
	letter-spacing: 0.6px;
	font-weight: 500;
	transition: color 0.3s ease;

	${SearchListItem}:hover & {
		color: #ffffff;
	}
`;
