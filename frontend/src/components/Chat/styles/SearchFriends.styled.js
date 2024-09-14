import styled from 'styled-components';
import magnifier from '../img/magnifier.svg';

const SearchFriendsContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	position: relative; /* Ensures dropdown is positioned correctly */
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 2px 10px 2px 30px; /* Add padding-left to make space for the icon */
	border: 1px solid #ccc;
	border-radius: 4px;
	background-image: url(${magnifier});
	background-size: 16px;
	background-position: 8px center;
	background-repeat: no-repeat;
`;

export const Dropdown = styled.div`
	position: absolute;
	top: 100%; /* Places the dropdown right below the input */
	left: 0;
	width: 100%;
	max-height: 200px; /* Limits the height of the dropdown */
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
	justify-content: space-between; /* Space out the friend name and button */

	&:hover {
	background-color: #f0f0f0;
	}
`;

export default SearchFriendsContainer;
