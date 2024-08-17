import React from "react";
import { SettingsContainer } from "../../styles/Profile/Settings.styled";
import { motion } from "framer-motion";

const SettingsGroup = ({ label, id, type, placeholder }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -10}}
			animate={{ opacity: 1, y: 0}}
			transition={{ duration: 0.3}}
		>
			<SettingsContainer.Group className="mb-3">
				<SettingsContainer.Label>{label}</SettingsContainer.Label>
				<SettingsContainer.Control id={id} type={type} placeholder={placeholder} />
			</SettingsContainer.Group>
		</motion.div>
	);
};

export default SettingsGroup;
