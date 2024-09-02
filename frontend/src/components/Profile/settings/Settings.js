import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Username from "./Username";
import DisplayName from "./DisplayName";
import Email from "./Email";
import Password from "./Password";
import Bio from "./Bio";
import Picture from "./Picture";
import Banner from "./Banner";
import ConfirmPassword from "./ConfirmPassword";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
	SettingsForm,
	SettingsItemContainer,
	SectionContainer,
	ButtonContainer,
	Separator,
	Header
} from "../styles/Settings.styled";
import API from "../../../api/api";

const Settings = ({ profileUser, setProfileUser, setShowSettings }) => {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState('');

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
		setSuccessMessage('Saved successfully');

		if (!formData) {
			setShowSettings(false);
			return;
		} else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
			setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
			return;
		}

		API.patch('/users/@me/profile', formData)
			.then(() => {
				setProfileUser(prev => ({ ...prev,...formData }));
			})
			.catch((err) => console.error(err));
	};

	return (
		<SectionContainer>
			<SettingsForm onSubmit={handleSubmit}>
				<Header>
					<i className="bi bi-arrow-left" onClick={() => setShowSettings(false)}/>
					<h2>SETTINGS</h2>
				</Header>
				<SettingsItemContainer>
					<Row>
						<Col><Username username={profileUser.username} handleChange={handleChange} error={errors.username}/></Col>
						<Col><DisplayName displayName={profileUser.displayName} handleChange={handleChange} error={errors.displayName}/></Col>
					</Row>
					<Email email={formData.email} handleChange={handleChange} error={errors.email}/>
					<Row>
						<Col><Password password={formData.password} handleChange={handleChange} error={errors.password}/></Col>
						<Col><ConfirmPassword confirmPassword={formData.confirmPassword} handleChange={handleChange} error={errors.confirmPassword}/></Col>
					</Row>
					<Separator/>
					<Bio bio={formData.bio} handleChange={handleChange}/>
					<Picture handleChange={handleChange}/>
					<Banner handleChange={handleChange}/>
					<Separator/>
				</SettingsItemContainer>
				<ButtonContainer>
					{successMessage && <p>{successMessage}</p>}
					<Button variant="success" type="submit">Save</Button>
				</ButtonContainer>
			</SettingsForm>
		</SectionContainer>
	);
};

export default Settings;
