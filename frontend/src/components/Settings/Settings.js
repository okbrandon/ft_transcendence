import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountPreferences from './AccountPreferences';
import Security from './Security';
import Visibility from './Visibility';
import Privacy from './Privacy';
import {
	ContentArea,
	PageContainer,
	SideBar,
	SidebarBackButton,
	SidebarButton,
} from './styles/Settings.styled';

const Settings = () => {
	const [activeSection, setActiveSection] = useState("account");
	const navigate = useNavigate();

	return (
		<PageContainer>
			<SideBar>
				<SidebarButton
					onClick={() => setActiveSection("account")}
					className={activeSection === "account" ? "active" : ""}
				>
					Account Preferences
				</SidebarButton>
				<SidebarButton
					onClick={() => setActiveSection("security")}
					className={activeSection === "security" ? "active" : ""}
				>
					Security
				</SidebarButton>
				<SidebarButton
					onClick={() => setActiveSection("visibility")}
					className={activeSection === "visibility" ? "active" : ""}
				>
					Visibility
				</SidebarButton>
				<SidebarButton
					onClick={() => setActiveSection("privacy")}
					className={activeSection === "privacy" ? "active" : ""}
				>
					Data Privacy
				</SidebarButton>
				<SidebarBackButton onClick={() => navigate(-1)}>
					Back
				</SidebarBackButton>

			</SideBar>

			<ContentArea>
				{activeSection === "account" && <AccountPreferences/>}
				{activeSection === "security" && <Security/>}
				{activeSection === "visibility" && <Visibility/>}
				{activeSection === "privacy" && <Privacy/>}
			</ContentArea>
		</PageContainer>
	);
};

export default Settings;
