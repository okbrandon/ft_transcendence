import React, { useState } from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Password = () => {
	const [passwordInput, setPasswordInput] = useState('');
	const [cfPasswordInput, setCfPasswordInput] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!passwordInput || !cfPasswordInput) {
			setError('Password cannot be empty');
		} else if (passwordInput !== cfPasswordInput) {
			setError('Passwords do not match');
		} else {
			setError('');
			API.patch('/users/@me/profile', { password: passwordInput })
				.then(() => {
					console.log('Password updated');
				})
				.catch((err) => console.error(err));
		}
	}

	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="password"><i className="bi bi-lock-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="password"
					value={passwordInput}
					onChange={(e) => setPasswordInput(e.target.value)}
					type="password"
					placeholder="New password"
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="cfpassword"><i className="bi bi-lock-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="cfpassword"
					value={cfPasswordInput}
					onChange={(e) => setCfPasswordInput(e.target.value)}
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
