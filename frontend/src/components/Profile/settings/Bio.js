import React, { useState } from "react";
import { SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Bio = ({ setProfileUser, bio }) => {
	const [bioInput, setBioInput] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		API.patch('/users/@me/profile', { bio: bioInput })
			.then(() => {
				console.log('Bio updated to ', bioInput);
				setProfileUser(prev => ({ ...prev, bio: bioInput }));
			})
			.catch((err) => console.error(err));
	};

	return (
		<SettingsItem>
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
		</SettingsItem>
	);
};

export default Bio;
