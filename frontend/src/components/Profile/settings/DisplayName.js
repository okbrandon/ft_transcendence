import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const DisplayName = ({ displayName, handleChange, error }) => {
	return (
		<SettingsItem $width="350px">
			<SettingsForm.Group className="mb-3">
				<h3>Display Name</h3>
				<SettingsForm.Label htmlFor="displayName"><i className="bi bi-person-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="displayName"
					name="displayName"
					type="text"
					placeholder={displayName ? displayName : 'Display name'}
					value={displayName}
					onChange={handleChange}
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default DisplayName;
