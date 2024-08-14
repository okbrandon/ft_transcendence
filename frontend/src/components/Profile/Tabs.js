import React from 'react';
import Tab from 'react-bootstrap/Tabs';
import MatchHistory from './MatchHistory';
import { ProfileTabs } from '../../styles/Profile/Tabs.styled';
import Stats from './Stats';

const Tabs = () => {
	return (
		<ProfileTabs defaultActiveKey="history" className="mb-3">
			<Tab eventKey="history" title="History">
				<MatchHistory/>
			</Tab>
			<Tab eventKey="stats" title="Stats">
				<Stats/>
			</Tab>
		</ProfileTabs>
	);
};

export default Tabs;
