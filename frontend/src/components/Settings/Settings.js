import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountPreferences from './AccountPreferences/AccountPreferences';
import Security from './Security/Security';
import Visibility from './Visibility';
import Privacy from './Privacy';
import {
	ContentArea,
	PageContainer,
	SideBar,
	SidebarBackButton,
	SidebarButton,
} from './styles/Settings.styled';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../styles/shared/Loader.styled';

const Settings = () => {
	const { user, setUser, loading } = useAuth();
	const [activeSection, setActiveSection] = useState("account");
	const navigate = useNavigate();

	if (loading) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	};

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
				{activeSection === "account" && <AccountPreferences user={user} setUser={setUser}/>}
				{activeSection === "security" && <Security user={user} setUser={setUser}/>}
				{activeSection === "visibility" && <Visibility/>}
				{activeSection === "privacy" && <Privacy/>}
			</ContentArea>
		</PageContainer>
	);
};

export default Settings;
