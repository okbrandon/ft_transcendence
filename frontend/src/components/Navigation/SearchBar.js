import React, { useEffect, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import debounce from 'lodash/debounce';
import SearchList from './SearchList';
import { SearchBarContainer } from './styles/Navigation.styled';
import { getUsers } from '../../api/user';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
	const navigate = useNavigate();
	const [input, setInput] = useState('');
	const { addNotification } = useNotification();
	const [results, setResults] = useState(null);
	const searchBarRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const { t } = useTranslation();

	const handleClickOutside = e => {
		if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
			setResults(null);
			setActiveIndex(-1);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	}, []);

	useEffect(() => {
		const debouncedSearch = debounce(query => {
			if (query) {
				getUsers(query)
					.then(users => {
						setResults(users);
					})
					.catch(err => {
						addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
					});
			} else {
				setResults(null);
			}
		}, 500);

		debouncedSearch(input);

		return () => {
			debouncedSearch.cancel();
		};
	}, [input, addNotification]);

	const handleInput = event => {
		setInput(event.target.value);
		setActiveIndex(-1);
	};

	const handleSubmit = e => {
		e.preventDefault();
	};

	const handleKeyDown = e => {
		if (results && results.length > 0) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setActiveIndex(prevIndex => (prevIndex + 1) % results.length);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				setActiveIndex(prevIndex => (prevIndex - 1 + results.length) % results.length);
			} else if (e.key === 'Tab') {
				e.preventDefault();
				setActiveIndex(prevIndex => (prevIndex + 1) % results.length);
			} else if (e.key === 'Enter' && activeIndex !== -1) {
				e.preventDefault();
				handleSelect(results[activeIndex].username);
			}
		}
	};

	const handleSelect = username => {
		setInput('');
		setResults(null);
		window.scrollTo(0, 0);
		navigate(`/profile/${username}`);
	};

	return (
		<SearchBarContainer onSubmit={e => handleSubmit(e)} ref={searchBarRef}>
			<label htmlFor="search">
				<i className="bi bi-search"/>
			</label>
			<FormControl
				id="search"
				type="text"
				placeholder={t('header.searchBar.placeholder')}
				className="mr-sm-2"
				value={input}
				onChange={handleInput}
				onKeyDown={handleKeyDown}
				autoComplete='off'
			/>
			{results && (
				<SearchList
					results={results}
					activeIndex={activeIndex}
					handleSelect={handleSelect}
				/>
			)}
		</SearchBarContainer>
	);
};

export default SearchBar;
