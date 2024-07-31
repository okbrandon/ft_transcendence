import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabsProfileContainer from '../../styles/layouts/TabsProfileContainer.styled';

const TabsProfile = () => {
	return (
		<TabsProfileContainer>
			<Tabs defaultActiveKey="history" id="uncontrolled-tab-example" className="mb-3">
				<Tab eventKey="history" title="History">
					<p>yippie</p>
				</Tab>
				<Tab eventKey="stats" title="Stats">
					<p>Tapas</p>
				</Tab>
			</Tabs>
		</TabsProfileContainer>
	);
};

export default TabsProfile;
