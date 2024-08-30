import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Username = ({ username, handleChange, error }) => {
	return (
		<SettingsItem $width="350px">
			<SettingsForm.Group className="mb-3">
				<h3>Username</h3>
				<SettingsForm.Label htmlFor="username"><i className="bi bi-person-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="username"
					name="username"
					type="text"
					placeholder={username ? username : "Display Name"}
					value={username}
					onChange={handleChange}
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default Username;
