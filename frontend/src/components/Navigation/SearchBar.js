import React, { useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { SearchBarContainer } from '../../styles/Home/Navigation.styled';
import SearchList from './SearchList';

const SearchBar = () => {
	const [input, setInput] = useState('');
	const [results, setResults] = useState(null);

	const handleInput = (event) => {
		setInput(event.target.value);
		// setResults(GetUsers(input));
		console.log(results);
	}

	return (
		<SearchBarContainer>
			<label htmlFor="search">
				<i className="bi bi-search"/>
			</label>
			<FormControl
				id="search"
				type="text"
				placeholder="Search"
				className="mr-sm-2"
				value={input}
				onChange={handleInput}
			/>
			{input && <SearchList input={input} results={results}/>}
		</SearchBarContainer>
	);
};

export default SearchBar;
