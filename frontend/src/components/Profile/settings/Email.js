import React, { useState } from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Email = ({ setProfileUser }) => {
	const [emailInput, setEmailInput] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (emailInput === '') {
			setError('Email cannot be empty');
		} else if (emailInput.includes('@') === false) {
			setError('Email must contain an @ symbol');
		} else {
			setError('');
			API.patch('/users/@me/profile', { email: emailInput })
				.then(() => {
					console.log('Email updated to ', emailInput);
					setProfileUser(prev => ({...prev, email: emailInput}));
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="email"><i className="bi bi-envelope-at-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					id="email"
					type="text"
					placeholder="email@address.com"
					value={emailInput}
					onChange={(e) => setEmailInput(e.target.value)}
					style={{borderColor: error ? 'red' : 'inherit'}}
				/>
			</SettingsForm.Group>
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default Email;
