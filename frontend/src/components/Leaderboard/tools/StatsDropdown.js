import React from 'react';
import styled from 'styled-components';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTranslation } from 'react-i18next';

const DropdownContainer = styled.div`
	margin-top: 10px;
	margin-bottom: 40px;
`;

const StatsDropdown = ({ stats, handleStatsChange }) => {
	const { t } = useTranslation();

	const handleItemClick = (value) => {
		handleStatsChange(value);
	};

	return (
		<DropdownContainer>
			<NavDropdown title={stats === 'gamesPlayed' ? t('leaderboard.stats.gamesPlayed') : stats === 'gamesWon' ? t('leaderboard.stats.gamesWon') : t('leaderboard.stats.gamesLost')} id="stats-dropdown">
				<NavDropdown.Item onClick={() => handleItemClick('gamesPlayed')}>{t('leaderboard.stats.gamesPlayed')}</NavDropdown.Item>
				<NavDropdown.Item onClick={() => handleItemClick('gamesWon')}>{t('leaderboard.stats.gamesWon')}</NavDropdown.Item>
				<NavDropdown.Item onClick={() => handleItemClick('gamesLost')}>{t('leaderboard.stats.gamesLost')}</NavDropdown.Item>
			</NavDropdown>
		</DropdownContainer>
	);
};

export default StatsDropdown;
