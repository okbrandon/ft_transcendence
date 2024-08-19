import React, { useState } from "react";
import { SettingsContainer, SettingsItemContainer, SettingsLayout } from "../../../styles/Profile/Settings.styled";
import Username from "./Username";
import DisplayName from "./DisplayName";
import Email from "./Email";
import Password from "./Password";
import Bio from "./Bio";
import Picture from "./Picture";
import Banner from "./Banner";

const Settings = ({ user, setUser, setShowSettings }) => {
	const [showDropdown, setShowDropdown] = useState(null);

	return (
		<SettingsLayout>
			<SettingsContainer>
				<i className="bi bi-arrow-left" onClick={() => setShowSettings(false)}/>
				<h2>SETTINGS</h2>
				<SettingsItemContainer>
					<Username
						showDropdown={showDropdown}
						setShowDropdown={setShowDropdown}
						username={user.username}
					/>
					<DisplayName
						showDropdown={showDropdown}
						setUser={setUser}
						setShowDropdown={setShowDropdown}
						displayName={user.displayName}
					/>
					<Email
						showDropdown={showDropdown}
						setUser={setUser}
						setShowDropdown={setShowDropdown}
						bio={user.bio}
					/>
					<Password
						showDropdown={showDropdown}
						setShowDropdown={setShowDropdown}
					/>
					<Bio
						showDropdown={showDropdown}
						setUser={setUser}
						setShowDropdown={setShowDropdown}
					/>
					<Picture
						showDropdown={showDropdown}
						setUser={setUser}
						setShowDropdown={setShowDropdown}
					/>
					<Banner
						showDropdown={showDropdown}
						setUser={setUser}
						setShowDropdown={setShowDropdown}
					/>
				</SettingsItemContainer>
			</SettingsContainer>
		</SettingsLayout>
	);
};

export default Settings;
