import styled from 'styled-components';

export const SearchFriendsContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	position: relative;
	background-color: #1b1b24;
	border-radius: 8px;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 10px;
	border: none;
	border-radius: 4px;
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	font-size: 0.9rem;

	&::placeholder {
		color: #ccc;
	}

	&:focus {
		outline: none;
		background-color: rgba(255, 255, 255, 0.2);
	}
`;

export const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	max-height: 200px;
	overflow-y: auto;
	background-color: #1e1e28;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 4px;
`;

export const FriendItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	cursor: pointer;
	color: white;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
`;

export const Username = styled.span`
	font-size: 0.9rem;
	margin-right: 10px;
`;

export const ButtonContainer = styled.div`
	display: flex;
`;

export const ActionButton = styled.button`
	margin: 0 2px;
	padding: 3px 5px;
	border: none;
	border-radius: 4px;
	color: white;
	font-size: 0.8rem;
	background-color: ${({ color }) => color};
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		opacity: 0.8;
	}
`;

export default SearchFriendsContainer;
