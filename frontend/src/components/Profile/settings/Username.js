import React, { useState } from "react";
import { SettingsDropdown, SettingsForm } from "../../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const Username = ({ username }) => {
	const [showUsername, setShowUsername] = useState(false);

	return (
		<>
			<SettingsDropdown onClick={() => setShowUsername(!showUsername)}>
				<h2>username</h2>
			</SettingsDropdown>
			{showUsername && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label htmlFor="username">Username</SettingsForm.Label>
							<SettingsForm.Control id="username" type="text" placeholder={username}/>
						</SettingsForm.Group>
					</SettingsForm>
				</motion.div>
			)}
		</>
	);
};

export default Username;
