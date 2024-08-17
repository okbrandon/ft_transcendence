import React, { useState } from "react";
import { SettingsDropdown, SettingsForm } from "../../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const Password = () => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<SettingsDropdown onClick={() => setShowPassword(!showPassword)}>
				<h2>password</h2>
			</SettingsDropdown>
			{showPassword && (
				<motion.div
					initial={{ opacity: 0, y: -10}}
					animate={{ opacity: 1, y: 0}}
					transition={{ duration: 0.3}}
				>
					<SettingsForm>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label>New password</SettingsForm.Label>
							<SettingsForm.Control id="password" type="password" placeholder="Password"/>
						</SettingsForm.Group>
						<SettingsForm.Group className="mb-3">
							<SettingsForm.Label>Confirm new password</SettingsForm.Label>
							<SettingsForm.Control id="cfpassword" type="password" placeholder="Confirm password"/>
						</SettingsForm.Group>
					</SettingsForm>
				</motion.div>
			)}
		</>
	);
};

export default Password;
