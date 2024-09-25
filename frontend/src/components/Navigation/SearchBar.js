import React, { useEffect, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import debounce from 'lodash/debounce';
import SearchList from './SearchList';
import { SearchBarContainer } from './styles/Navigation.styled';
import { GetUsers } from '../../api/user';

const SearchBar = () => {
	const [input, setInput] = useState('');
	const [results, setResults] = useState(null);
	const searchBarRef = useRef(null);

	const handleClickOutside = e => {
		if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
			setResults(null);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	}, []);

	useEffect(() => {
		const debouncedSearch = debounce((query) => {
			if (query) {
				GetUsers(query)
				.then((users) => {
					setResults(users);
				})
				.catch((err) => {
					console.error(err?.response?.data?.error || 'An error occurred');
				});
			} else {
				setResults(null);
			}
		}, 500);

		debouncedSearch(input);

		return () => {
			debouncedSearch.cancel();
		};
	}, [input]);

	const handleInput = event => {
		setInput(event.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
	};

	return (
		<SearchBarContainer onSubmit={e => handleSubmit(e)} ref={searchBarRef}>
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
