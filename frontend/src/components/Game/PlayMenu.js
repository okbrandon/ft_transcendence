import React from "react";
import { useNavigate } from "react-router-dom";
import { ModeCard, ModesContainer, PlayMenuContainer, Title } from "./styles/PlayMenu.styled";

const PlayMenu = () => {
	const navigate = useNavigate();

	return (
		<PlayMenuContainer>
			<Title>Select Game Mode</Title>
			<ModesContainer>
				<ModeCard onClick={() => navigate('/game-ai')}>
					<h1>AI</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/tournament')}>
					<h1>Tournament</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/game-classic')}>
					<h1>1 v 1</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/game-local')}>
					<h1>Local</h1>
				</ModeCard>
			</ModesContainer>
		</PlayMenuContainer>
	);
};

export default PlayMenu;
