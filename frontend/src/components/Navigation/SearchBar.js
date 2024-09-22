import React, { useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import SearchList from './SearchList';
import { SearchBarContainer } from './styles/Navigation.styled';
import { GetUsers } from '../../api/user';

const SearchBar = () => {
	const [input, setInput] = useState('');
	const [results, setResults] = useState(null);

	const handleInput = (event) => {
		const newInput = event.target.value;
		setInput(newInput);
		if (newInput) {
			GetUsers(newInput)
				.then(users => {
					setResults(users);
				})
				.catch(err => {
					console.error(err?.response?.data?.error || 'An error occurred');
				});
		} else {
			setResults(null);
		}
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
				autoComplete='off'
			/>
			{results && <SearchList results={results} setInput={setInput} setResults={setResults}/>}
		</SearchBarContainer>
	);
};

export default SearchBar;
