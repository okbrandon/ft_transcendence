import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Bio = ({ showDropdown, setUser, setShowDropdown, bio }) => {
	const [bioInput, setBioInput] = useState('');

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'bio' ? null : 'bio');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		API.patch('/users/@me/profile', { bio: bioInput })
			.then(() => {
				console.log('Bio updated to ', bioInput);
				setUser(prev => ({ ...prev, bio: bioInput }));
			})
			.catch(console.error);
	};

	return (
		<SettingsItem $expanded={showDropdown === 'bio' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'bio'}
			>
				<h2>Bio</h2>
			</SettingsDropdown>
			{showDropdown === 'bio' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label htmlFor="bio"><i className="bi bi-pencil-square"/></SettingsForm.Label>
							<SettingsForm.Control
								id="bio"
								as="textarea"
								rows={3}
								maxLength={160}
								placeholder={bio ? bio : 'Bio'}
								value={bioInput}
								onChange={(e) => setBioInput(e.target.value)}
								style={{resize: 'none'}}
							/>
							<p>{bioInput.length}/160</p>
						</SettingsForm.Group>
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
};

export default Bio;
