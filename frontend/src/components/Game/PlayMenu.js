import React from "react";
import { useNavigate } from "react-router-dom";
import { PlayMenuCard, PlayMenuContainer } from "./styles/PlayMenu.styled";

const PlayMenu = () => {
	const navigate = useNavigate();

	return (
		<PlayMenuContainer>
			<PlayMenuCard onClick={() => navigate('/game')}>
				<h1>AI</h1>
			</PlayMenuCard>
			<PlayMenuCard onClick={() => navigate('/tournament')}>
				<h1>Tournament</h1>
			</PlayMenuCard>
			<PlayMenuCard onClick={() => navigate('/game')}>
				<h1>1 v 1</h1>
			</PlayMenuCard>
		</PlayMenuContainer>
	);
};

export default PlayMenu;
