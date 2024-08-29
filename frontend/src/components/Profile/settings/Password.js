import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Password = ({ password, confirmPassword, handleChange, error}) => {
	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
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
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="confirmPassword"><i className="bi bi-lock-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="confirmPassword"
					name="confirmPassword"
					value={confirmPassword}
					onChange={handleChange}
					type="password"
					placeholder="Confirm password"
					style={{borderColor: error ? 'red' : 'inherit'}}
				/> {/* have to check the password rules */}
			</SettingsForm.Group>
			{error && <ErrorMessage>Passwords do not match</ErrorMessage>}
		</SettingsItem>
	);
};

export default Password;
