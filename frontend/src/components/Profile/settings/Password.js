import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Password = ({ showDropdown, setShowDropdown}) => {
	const [passwordInput, setPasswordInput] = useState('');
	const [cfPasswordInput, setCfPasswordInput] = useState('');
	const [error, setError] = useState('');

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'password' ? null : 'password');
		setError('');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!passwordInput || !cfPasswordInput) {
			setError('Password cannot be empty');
		} else if (passwordInput !== cfPasswordInput) {
			setError('Passwords do not match');
		} else {
			setError('');
		}
	}

	return (
		<SettingsItem $expanded={showDropdown === 'password' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'password'}
			>
				<h2>password</h2>
			</SettingsDropdown>
			{showDropdown === 'password' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
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
						{error && <p style={{color: 'red'}}>Passwords do not match</p>}
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
};

export default Password;
