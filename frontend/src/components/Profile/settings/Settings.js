import React from "react";
import { SettingsContainer, SettingsLayout } from "../../../styles/Profile/Settings.styled";
import { CardTitle } from "../../../styles/Profile/Profile.styled";
import Username from "./Username";
import DisplayName from "./DisplayName";
import Email from "./Email";
import Password from "./Password";
import Bio from "./Bio";

const Settings = ({ user }) => {
	return (
		<SettingsLayout>
			<SettingsContainer>
				<CardTitle>SETTINGS</CardTitle>
					<Username username={user.username}/>
					<DisplayName displayName={user.displayName}/>
					<Email/>
					<Password/>
					<Bio/>
			</SettingsContainer>
		</SettingsLayout>
	);
};

export default Settings;
