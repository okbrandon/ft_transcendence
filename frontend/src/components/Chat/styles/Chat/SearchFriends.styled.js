import styled from 'styled-components';
import magnifier from '../../img/magnifier.svg';

const SearchFriendsContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	position: relative;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 2px 10px 2px 30px;
	border: 1px solid #ccc;
	border-radius: 4px;
	background-image: url(${magnifier});
	background-size: 16px;
	background-position: 8px center;
	background-repeat: no-repeat;
`;

export const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	max-height: 200px;
	overflow-y: auto;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
	z-index: 1000;
`;

export const FriendItem = styled.div`
	padding: 10px;
	border-bottom: 1px solid #ccc;
	cursor: pointer;
	color: black;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&:hover {
		background-color: #f0f0f0;
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
