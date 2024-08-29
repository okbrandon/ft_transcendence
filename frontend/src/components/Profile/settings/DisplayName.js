import React, { useState } from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const DisplayName = ({ setProfileUser, displayName }) => {
	const [displayNameInput, setDisplayNameInput] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (displayNameInput === '') {
			setError('Display name cannot be empty');
		} else {
			setError('');
			API.patch('/users/@me/profile', { displayName: displayNameInput })
				.then(() => {
					console.log('Display name updated to ', displayNameInput);
					setProfileUser(prev => ({...prev, displayName: displayNameInput}));
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<SettingsItem $width="350px">
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="displayName"><i className="bi bi-person-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="displayName"
					type="text"
					placeholder={displayName ? displayName : 'Display name'}
					value={displayNameInput}
					onChange={(e) => setDisplayNameInput(e.target.value)}
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default DisplayName;
