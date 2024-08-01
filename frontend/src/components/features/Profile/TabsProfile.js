import React from 'react';
import Tab from 'react-bootstrap/Tabs';
import ProfileTabs from '../../styles/shared/profile/profileTabs.styled';
import TabsProfileContainer from '../../styles/layouts/TabsProfileContainer.styled';
import MatchHistory from './MatchHistory';

const TabsProfile = () => {
	return (
		<TabsProfileContainer>
			<ProfileTabs defaultActiveKey="history" className="mb-3">
				<Tab eventKey="history" title="History">
					<MatchHistory/>
				</Tab>
				<Tab eventKey="stats" title="Stats">
					<p>Tapas</p>
				</Tab>
			</ProfileTabs>
		</TabsProfileContainer>
	);
};

export default TabsProfile;
