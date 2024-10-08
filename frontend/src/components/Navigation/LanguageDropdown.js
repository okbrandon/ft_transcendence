import React from "react";
import { LanguageDropdownButton } from "./styles/LanguageDropdown.styled";

const LanguageDropdown = ({ handleChange, language }) => {
	return (
		<LanguageDropdownButton
			id="nav-lang"
			value={language}
			onChange={handleChange}
			autoComplete="off"
		>
			<option value="en">🇬🇧 en</option>
			<option value="es">🇪🇸 es</option>
			<option value="fr">🇫🇷 fr</option>
		</LanguageDropdownButton>
	);
};

export default LanguageDropdown;
