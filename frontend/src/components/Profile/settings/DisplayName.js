import React, { useState } from "react";
import { SettingsDropdown, SettingsForm } from "../../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const DisplayName = ({ displayName }) => {
	const [showDisplayName, setShowDisplayName] = useState(false);

	return (
		<>
			<SettingsDropdown onClick={() => setShowDisplayName(!showDisplayName)}>
				<h2>display name</h2>
			</SettingsDropdown>
			{showDisplayName && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label>Display name</SettingsForm.Label>
							<SettingsForm.Control id="displayName" type="text" placeholder={displayName ? displayName : 'Display name'}/>
						</SettingsForm.Group>
					</SettingsForm>
				</motion.div>
			)}
		</>
	);
};

export default DisplayName;
