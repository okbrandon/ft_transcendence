import React, { useState } from "react";
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
import API from "../../../api/api";

const Settings = ({ profileUser, setProfileUser, setShowSettings }) => {
	const [formData, setFormData] = useState({
		username: profileUser.username,
		displayName: profileUser.displayName,
		email: profileUser.email,
		bio: profileUser.bio,
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(data => ({
			...data,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});

		if (formData.password !== formData.confirmPassword) {
			setErrors(prev => ({...prev, password: 'Passwords do not match'}));
			return;
		}

		// API call to update user
		API.patch('/users/@me/profile', formData)
			.then(() => {
				setProfileUser(prev => ({
					...profileUser,
					...formData,
				}));
				console.log('Profile updated');
			})
			.catch((err) => console.error(err));
	};

	return (
		<SectionContainer>
			<SettingsForm onSubmit={handleSubmit}>
				<i className="bi bi-arrow-left" onClick={() => setShowSettings(false)}/>
				<h2>SETTINGS</h2>
				<SettingsItemContainer>
					<Row>
						<Col><Username username={profileUser.username} handleChange={handleChange} error={errors.username}/></Col>
						<Col><DisplayName displayName={profileUser.displayName} handleChange={handleChange} error={errors.displayName}/></Col>
					</Row>
					<Email email={formData.email} handleChange={handleChange} error={errors.email}/>
					<Password password={formData.password} confirmPassword={FormData.confirmPassword} handleChange={handleChange} error={errors.password}/>
					<Bio bio={formData.bio} handleChange={handleChange}/>
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
