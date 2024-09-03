import React, { useState, useRef } from "react";
import { Preview, PreviewBannerContainer, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import { GetImage } from "../../../api/user";

const Banner = ({ handleChange }) => {
	const bannerInputRef = useRef(null);
	const [preview, setPreview] = useState(null);

	const handleFileChange = () => {
		const file = bannerInputRef.current.files[0];

		if (!file) {
			return;
		}

		GetImage(file)
			.then((base64) => {
				handleChange({ target: { name: 'bannerID', value: base64 } });
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
					<h3>Profile Banner</h3>
					<SettingsForm.Label htmlFor="banner"><i className="bi bi-image-fill"/></SettingsForm.Label>
					<SettingsForm.Control
						id="banner"
						type="file"
						ref={bannerInputRef}
						onChange={handleFileChange}
					/>
				</SettingsForm.Group>
			</SettingsItem>
			{preview && (
				<PreviewBannerContainer>
					<Preview src={preview} alt="Profile Banner Preview" $isProfile={false}/>
				</PreviewBannerContainer>
			)}
		</>
	);
}

export default Banner;
