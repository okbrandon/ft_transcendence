import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Password = ({ password, handleChange, error}) => {
	return (
		<SettingsItem $width="350px">
			<SettingsForm.Group className="mb-3">
				<h3>Password</h3>
				<SettingsForm.Label htmlFor="password"><i className="bi bi-lock-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="password"
					name="password"
					value={password}
					onChange={handleChange}
					type="password"
					placeholder="New password"
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
		</SettingsItem>
	);
};

export default Password;
