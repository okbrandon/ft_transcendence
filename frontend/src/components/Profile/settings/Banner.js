import React, { useRef } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Banner = ({ showDropdown, setProfileUser, setShowDropdown }) => {
	const bannerInputRef = useRef(null);
	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'banner' ? null : 'banner');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const file = bannerInputRef.current.files[0];
		if (!file) {
			console.log('No file selected');
			return;
		}

		API.patch('/users/@me/profile', { bannerID: URL.createObjectURL(file) })
			.then(() => {
				console.log('Banner updated');
				setProfileUser(prev => ({...prev, bannerID: URL.createObjectURL(file)}));
			})
			.catch((error) => console.error(error));
	};

	return (
		<SettingsItem $expanded={showDropdown === 'banner' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'banner'}
				style={{
					borderRadius: showDropdown === 'banner' ? '' : '0 0 50px 50px',
					transition: 'border-radius 0.1s ease'
				}}
			>
				<h2>Profile banner</h2>
			</SettingsDropdown>
			{showDropdown === 'banner' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label htmlFor="banner"><i className="bi bi-image-fill"/></SettingsForm.Label>
							<SettingsForm.Control
								type="file"
								id="banner"
								ref={bannerInputRef}
							/>
						</SettingsForm.Group>
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
}

export default Banner;
