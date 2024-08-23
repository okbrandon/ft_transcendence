import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Email = ({ showDropdown, setUser, setShowDropdown }) => {
	const [emailInput, setEmailInput] = useState('');
	const [error, setError] = useState('');

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'email' ? null : 'email');
		setError('');
	};

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
					setUser(prev => ({...prev, email: emailInput}));
				})
				.catch(console.error);
		}
	};

	return (
		<SettingsItem $expanded={showDropdown === 'email' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'email'}
			>
				<h2>email</h2>
			</SettingsDropdown>
			{showDropdown === 'email' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
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
						{error && <p style={{color: 'red'}}>{error}</p>}
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
};

export default Email;
