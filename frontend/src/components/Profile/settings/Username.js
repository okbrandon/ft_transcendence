import React, { useState } from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Username = ({ username }) => {
	const [usernameInput, setUsernameInput] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(usernameInput);
		if (usernameInput === '') {
			setError('Username cannot be empty');
		} else {
			setError('');
			API.patch('/users/@me/profile', { username: usernameInput })
				.then(() => {
					console.log('Username updated to ', usernameInput);
					setUsernameInput(prev => ({...prev, username: usernameInput}));
				})
				.catch((err) => console.error(err));
		}
	};

	return (
		<SettingsItem $width="350px">
            <SettingsForm.Group className="mb-3">
                <SettingsForm.Label htmlFor="username"><i className="bi bi-person-fill"/></SettingsForm.Label>
                <SettingsForm.Control
                    id="username"
                    type="text"
                    placeholder={username}
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    style={{borderColor: error ? 'red' : 'inherit'}}
                />
            </SettingsForm.Group>
            {error && <ErrorMessage>{error}</ErrorMessage>}
		</SettingsItem>
	);
};

export default Username;
