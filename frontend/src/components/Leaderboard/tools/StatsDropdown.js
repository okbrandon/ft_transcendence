import React from 'react';
import styled from 'styled-components';
import NavDropdown from 'react-bootstrap/NavDropdown';

const DropdownContainer = styled.div`
	margin-top: 10px;
	margin-bottom: 40px;
`;

const StatsDropdown = ({ stats, handleStatsChange }) => {
	const handleItemClick = (value) => {
		handleStatsChange(value);
	};

	// Brandon: translate each dropdown items
	return (
		<DropdownContainer>
			<NavDropdown title={stats === 'gamesPlayed' ? 'Games Played' : stats === 'gamesWon' ? 'Games Won' : 'Games Lost'} id="stats-dropdown">
				<NavDropdown.Item onClick={() => handleItemClick('gamesPlayed')}>Games Played</NavDropdown.Item>
				<NavDropdown.Item onClick={() => handleItemClick('gamesWon')}>Games Won</NavDropdown.Item>
				<NavDropdown.Item onClick={() => handleItemClick('gamesLost')}>Games Lost</NavDropdown.Item>
			</NavDropdown>
		</DropdownContainer>
	);
};

export default StatsDropdown;
