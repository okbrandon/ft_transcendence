import React, { useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import SearchBarContainer from '../../styles/layouts/SearchBarContainer.styled';

const SearchBar = () => {
	const [search, setSearch] = useState('');

	return (
		<SearchBarContainer>
			<i className="bi bi-search" style={{'color': 'black', 'marginRight': '10px', 'fontSize': '20px'}}></i>
			<FormControl
				type="text"
				placeholder="Search"
				className="mr-sm-2"
				value={search}
				onChange={event => setSearch(event.target.value)}
			/>
		</SearchBarContainer>
	);
};

export default SearchBar;
