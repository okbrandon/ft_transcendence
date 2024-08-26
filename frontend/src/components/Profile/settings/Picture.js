import React, { useRef } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import { SettingsDropdown, SettingsForm, SettingsItem } from "../styles/Settings.styled";
import API from "../../../api/api";

const Picture = ({ showDropdown, setProfileUser, setShowDropdown }) => {
	const fileInputRef = useRef(null);

	const handleDropdown = () => {
		setShowDropdown(prev => prev === 'picture' ? null : 'picture');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const file = fileInputRef.current.files[0];
		if (!file) {
			console.log('No file selected');
			return;
		}

		API.patch('/users/@me/profile', { avatarID: URL.createObjectURL(file) })
			.then(() => {
				console.log('Profile picture updated');
				setProfileUser(prev => ({...prev, avatarID: URL.createObjectURL(file)}));
			})
			.catch((err) => console.error(err));
	};

	return (
		<SettingsItem $expanded={showDropdown === 'picture' ? 1 : 0}>
			<SettingsDropdown
				onClick={handleDropdown}
				$expanded={showDropdown === 'picture'}
			>
				<h2>Profile picture</h2>
			</SettingsDropdown>
			{showDropdown === 'picture' && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm onSubmit={handleSubmit}>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label htmlFor="picture"><i className="bi bi-image-fill"/></SettingsForm.Label>
							<SettingsForm.Control
								type="file"
								id="picture"
								ref={fileInputRef}
							/>
						</SettingsForm.Group>
						<Button variant="primary" type="submit">Update</Button>
					</SettingsForm>
				</motion.div>
			)}
		</SettingsItem>
	);
}

export default Picture;
