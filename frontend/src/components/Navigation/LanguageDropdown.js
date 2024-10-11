import React from "react";
import { LanguageDropdownButton } from "./styles/LanguageDropdown.styled";

const LanguageDropdown = ({ handleChange, language }) => {
	if (!language) return null;

	return (
		<LanguageDropdownButton
			id="nav-lang"
			value={language}
			onChange={handleChange}
			autoComplete="off"
		>
			<option value="EN">🇬🇧 en</option>
			<option value="ES">🇪🇸 es</option>
			<option value="FR">🇫🇷 fr</option>
		</LanguageDropdownButton>
	);
};

export default LanguageDropdown;
