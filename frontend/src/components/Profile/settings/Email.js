import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Email = ({ email, handleChange, error }) => {
	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
				<h3>Email</h3>
				<SettingsForm.Label htmlFor="email"><i className="bi bi-envelope-at-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="email"
					name="email"
					type="text"
					placeholder={email ? email : 'Email'}
					onChange={handleChange}
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default Email;
