import React from "react";
import { PlayMenuCard, PlayMenuContainer } from "../../styles/Game/PlayMenu.styled";

const PlayMenu = () => {
	return (
		<PlayMenuContainer>
			<PlayMenuCard>
				<h1>AI</h1>
			</PlayMenuCard>
			<PlayMenuCard>
				<h1>Tournament</h1>
			</PlayMenuCard>
			<PlayMenuCard>
				<h1>1 v 1</h1>
			</PlayMenuCard>
		</PlayMenuContainer>
	);
};

export default PlayMenu;
