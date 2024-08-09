import React from 'react';
import Tab from 'react-bootstrap/Tabs';
import MatchHistory from './MatchHistory';
import { TabsContainer, ProfileTabs } from '../../styles/Profile.styled';
import Stats from './Stats';

const TabsProfile = ({ setTabsLoaded }) => {
	return (
		<TabsContainer>
			<ProfileTabs defaultActiveKey="history" className="mb-3">
				<Tab eventKey="history" title="History">
					<MatchHistory setTabsLoaded={setTabsLoaded}/>
				</Tab>
				<Tab eventKey="stats" title="Stats">
					<Stats/>
				</Tab>
			</ProfileTabs>
		</TabsContainer>
	);
};

export default TabsProfile;
