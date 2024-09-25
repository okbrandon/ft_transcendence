import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LanguageDropdownButton } from "./styles/LanguageDropdown.styled";
import API from "../../api/api";

const LanguageDropdown = () => {
	const { user, setUser } = useContext(AuthContext);
	const [language, setLanguage] = useState(user?.lang || "en");

	const handleChange = (e) => {
		setLanguage(e.target.value);
		API.patch('/users/@me/profile', { lang: e.target.value })
			.then(() => {
				setUser(prev => ({
					...prev,
					lang: e.target.value,
				}));
			})
			.catch(err => {
				console.error(err.response?.data?.error || 'An error occurred');
			});
	};

	return (
		<LanguageDropdownButton
			id="nav-lang"
			value={language}
			onChange={handleChange}
		>
			<option value="en">🇬🇧 en</option>
			<option value="es">🇪🇸 es</option>
			<option value="fr">🇫🇷 fr</option>
		</LanguageDropdownButton>
	);
};

export default LanguageDropdown;
