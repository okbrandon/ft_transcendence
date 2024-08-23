import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Username = ({ showDropdown, setShowDropdown, username }) => {
	const [usernameInput, setUsernameInput] = useState('');
	const [error, setError] = useState('');

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'username' ? null : 'username');
		setError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(usernameInput);
		if (usernameInput === '') {
			setError('Username cannot be empty');
		} else {
			setError('');
			API.patch('/users/@me/profile', { username: usernameInput })
				.then(() => console.log('Username cannot be updated shame on you Leader'))
				.catch(console.error);
		}
	};

	return (
		<SettingsItem $expanded={showDropdown === 'username' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'username'}
			>
				<h2>username</h2>
			</SettingsDropdown>
			{showDropdown === 'username' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
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
						{error && <p style={{color: 'red'}}>{error}</p>}
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
};

export default Username;
