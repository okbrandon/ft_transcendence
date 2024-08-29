import React, { useRef } from "react";
import { SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";
import { GetImage } from "../../../api/user";

const Banner = ({ setProfileUser }) => {
	const bannerInputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		const file = bannerInputRef.current.files[0];
		if (!file) {
			console.log('No file selected');
			return;
		}

		GetImage(file).then((base64) => {
			API.patch('/users/@me/profile', { bannerID: base64 })
				.then(() => {
					console.log('Profile picture updated');
					setProfileUser(prev => ({...prev, bannerID: base64}));
				})
				.catch((err) => console.error(err));
		}).catch((error) => {
			console.error(error);
		});
	};

	return (
		<SettingsItem>
			<SettingsForm.Group className="mb-3">
				<SettingsForm.Label htmlFor="banner"><i className="bi bi-image-fill"/></SettingsForm.Label>
				<SettingsForm.Control
					type="file"
					id="banner"
					ref={bannerInputRef}
				/>
			</SettingsForm.Group>
		</SettingsItem>
	);
}

export default Banner;
