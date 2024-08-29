import React from "react";
import Button from "react-bootstrap/Button";
import Username from "./Username";
import DisplayName from "./DisplayName";
import Email from "./Email";
import Password from "./Password";
import Bio from "./Bio";
import Picture from "./Picture";
import Banner from "./Banner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SettingsForm, SettingsItemContainer, SectionContainer, ButtonContainer } from "../styles/Settings.styled";

const Settings = ({ profileUser, setProfileUser, setShowSettings }) => {
	return (
		<SectionContainer>
			<SettingsForm>
				<i className="bi bi-arrow-left" onClick={() => setShowSettings(false)}/>
				<h2>SETTINGS</h2>
				<SettingsItemContainer>
					<Row>
						<Col><Username username={profileUser.username}/></Col>
						<Col><DisplayName setProfileUser={setProfileUser} displayName={profileUser.displayName}/></Col>
					</Row>
					<Email setProfileUser={setProfileUser} bio={profileUser.bio}/>
					<Password/>
					<Bio setProfileUser={setProfileUser}/>
					<Picture setProfileUser={setProfileUser}/>
					<Banner setProfileUser={setProfileUser}/>
				</SettingsItemContainer>
				<ButtonContainer>
					<Button variant="success" type="submit">Save</Button>
				</ButtonContainer>
			</SettingsForm>
		</SectionContainer>
	);
};

export default Settings;
