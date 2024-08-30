import React from "react";
import { SettingsForm, SettingsItem } from "../styles/Settings.styled";

const Bio = ({ bio, handleChange }) => {
	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
				<h3>Bio</h3>
				<SettingsForm.Label htmlFor="bio"><i className="bi bi-pencil-square"/></SettingsForm.Label>
				<SettingsForm.Control
					id="bio"
					name="bio"
					as="textarea"
					rows={3}
					maxLength={160}
					placeholder={bio ? bio : 'Bio'}
					value={bio}
					onChange={handleChange}
					style={{resize: 'none'}}
				/>
				<p>{bio ? bio.length : 0}/160</p>
			</SettingsForm.Group>
		</SettingsItem>
	);
};

export default Bio;
