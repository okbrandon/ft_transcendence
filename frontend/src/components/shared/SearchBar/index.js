import React, { useState } from 'react';
import { SearchBarContainer } from '../../styles/layouts/ProfileContainer.styled';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

const SearchBar = () => {
	const [search, setSearch] = useState('');

	return (
		<SearchBarContainer>
			<Form inline>
				<FormControl
					type="text"
					placeholder="Search"
					className="mr-sm-2"
					value={search}
					onChange={event => setSearch(event.target.value)}
				/>
			</Form>
		</SearchBarContainer>
	);
};

export default SearchBar;

