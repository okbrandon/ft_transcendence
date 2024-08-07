import React from 'react';
import Tab from 'react-bootstrap/Tabs';
import MatchHistory from './MatchHistory';
import { TabsContainer, ProfileTabs } from '../../styles/Profile.styled';

const TabsProfile = () => {
	return (
		<TabsContainer>
			<ProfileTabs defaultActiveKey="history" className="mb-3">
				<Tab eventKey="history" title="History">
					<MatchHistory/>
				</Tab>
				<Tab eventKey="stats" title="Stats">
					<p>Tapas</p>
				</Tab>
			</ProfileTabs>
		</TabsContainer>
	);
};

export default TabsProfile;
