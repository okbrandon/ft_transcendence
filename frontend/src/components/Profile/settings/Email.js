import React, { useState } from "react";
import { SettingsDropdown, SettingsForm } from "../../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const Email = () => {
	const [showEmail, setShowEmail] = useState(false);

	return (
		<>
			<SettingsDropdown onClick={() => setShowEmail(!showEmail)}>
				<h2>email</h2>
			</SettingsDropdown>
			{showEmail && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label>Email</SettingsForm.Label>
							<SettingsForm.Control id="email" type="email" placeholder="name@email.com"/>
						</SettingsForm.Group>
					</SettingsForm>
				</motion.div>
			)}
		</>
	);
};

export default Email;
