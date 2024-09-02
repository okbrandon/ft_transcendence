import React, { useState, useRef } from "react";
import { Preview, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import { GetImage } from "../../../api/user";

const Picture = ({ handleChange }) => {
	const fileInputRef = useRef(null);
	const [preview, setPreview] = useState(null);

	const handleFileChange = () => {
		const file = fileInputRef.current.files[0];
		if (!file) {
			return;
		}

		GetImage(file)
			.then((base64) => {
				handleChange({ target: { name: 'avatarID', value: base64 } });
				setPreview(base64);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<>
			<SettingsItem>
				<SettingsForm.Group className="mb-3">
					<h3>Profile Picture</h3>
					<SettingsForm.Label htmlFor="picture"><i className="bi bi-image-fill"/></SettingsForm.Label>
					<SettingsForm.Control
						id="picture"
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
					/>
				</SettingsForm.Group>
			</SettingsItem>
			{preview && <Preview src={preview} alt="Picture Preview" isProfile={true}/>}
		</>
	);
}

export default Picture;
