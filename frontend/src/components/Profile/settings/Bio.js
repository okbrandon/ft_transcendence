import React, { useState } from "react";
import { SettingsDropdown, SettingsForm } from "../../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const Bio = () => {
	const [showBio, setShowBio] = useState(false);

	return (
		<>
			<SettingsDropdown onClick={() => setShowBio(!showBio)}>
				<h2>Bio</h2>
			</SettingsDropdown>
			{showBio && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label>Bio</SettingsForm.Label>
							<SettingsForm.Control as="textarea" rows={3}/>
						</SettingsForm.Group>
					</SettingsForm>
				</motion.div>
			)}
		</>
	);
};

export default Bio;
