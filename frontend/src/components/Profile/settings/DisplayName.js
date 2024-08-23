import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const DisplayName = ({ showDropdown, setUser, setShowDropdown, displayName }) => {
	const [displayNameInput, setDisplayNameInput] = useState('');
	const [error, setError] = useState('');

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'displayname' ? null : 'displayname');
		setError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (displayNameInput === '') {
			setError('Display name cannot be empty');
		} else {
			setError('');
			API.patch('/users/@me/profile', { displayName: displayNameInput })
				.then(() => {
					console.log('Display name updated to ', displayNameInput);
					setUser(prev => ({...prev, displayName: displayNameInput}));
				})
				.catch(console.error);
		}
	};

	return (
		<SettingsItem $expanded={showDropdown === 'displayname' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'displayname'}
			>
				<h2>display name</h2>
			</SettingsDropdown>
			{showDropdown === 'displayname' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
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
						{error && <p style={{color: 'red'}}>{error}</p>}
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
};

export default DisplayName;
