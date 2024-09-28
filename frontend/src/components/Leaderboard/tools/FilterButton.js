import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
	FilterButtonContainer,
} from '../styles/tools/FilterButton.styled';

const FilterButton = () => {
	return (
		<FilterButtonContainer>
			<NavDropdown title="Top Win" id="nav-dropdown" menuVariant='dark'>
				<NavDropdown.Item eventKey="4.1">Top Win</NavDropdown.Item>
				<NavDropdown.Item eventKey="4.2">Top Loss</NavDropdown.Item>
			</NavDropdown>
			{/* adding daily weekly lifetime */}
		</FilterButtonContainer>
	);
};

export default FilterButton;
