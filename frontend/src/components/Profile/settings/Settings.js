import React, { useState } from "react";
import Username from "./Username";
import DisplayName from "./DisplayName";
import Email from "./Email";
import Password from "./Password";
import Bio from "./Bio";
import Picture from "./Picture";
import Banner from "./Banner";
import { SettingsContainer, SettingsItemContainer, SectionContainer } from "../styles/Settings.styled";

const Settings = ({ profileUser, setProfileUser, setShowSettings }) => {
	const [showDropdown, setShowDropdown] = useState(null);

	return (
		<SectionContainer>
			<SettingsContainer>
				<i className="bi bi-arrow-left" onClick={() => setShowSettings(false)}/>
				<h2>SETTINGS</h2>
				<SettingsItemContainer>
					<Username
						showDropdown={showDropdown}
						setShowDropdown={setShowDropdown}
						username={profileUser.username}
					/>
					<DisplayName
						showDropdown={showDropdown}
						setProfileUser={setProfileUser}
						setShowDropdown={setShowDropdown}
						displayName={profileUser.displayName}
					/>
					<Email
						showDropdown={showDropdown}
						setProfileUser={setProfileUser}
						setShowDropdown={setShowDropdown}
						bio={profileUser.bio}
					/>
					<Password
						showDropdown={showDropdown}
						setShowDropdown={setShowDropdown}
					/>
					<Bio
						showDropdown={showDropdown}
						setProfileUser={setProfileUser}
						setShowDropdown={setShowDropdown}
					/>
					<Picture
						showDropdown={showDropdown}
						setProfileUser={setProfileUser}
						setShowDropdown={setShowDropdown}
					/>
					<Banner
						showDropdown={showDropdown}
						setProfileUser={setProfileUser}
						setShowDropdown={setShowDropdown}
					/>
				</SettingsItemContainer>
			</SettingsContainer>
		</SectionContainer>
	);
};

export default Settings;
