import styled from 'styled-components';
import Form from 'react-bootstrap/Form';

const SearchBar = styled(Form)`
	display: flex;
	align-items: center;
	background-color: white;
	border-radius: 30px;
	padding: 5px 20px;
	width: 500px;

	& .form-control {
		border: none;
		border-radius: 0;
		background-color: transparent;
		border-bottom: 1px solid #c9c9c9;
		margin: 10px 0;
		&:focus {
			outline: none;
			box-shadow: none;
		}
	}
`;

export default SearchBar;
