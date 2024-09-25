import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayMenuCard, PlayMenuContainer } from "./styles/PlayMenu.styled";
import API from "../../api/api";
import { GameContext } from "../../context/GameContext";

const PlayMenu = () => {
	const navigate = useNavigate();

	async function createMatch(type) {
		let res = await API.post("/matches", {
			"type": type
		})

		navigate(`/game/${res.data.game_token}`)
	}

	return (
		<PlayMenuContainer>
			<PlayMenuCard onClick={() => createMatch("ai")}>
				<h1>AI</h1>
			</PlayMenuCard>
			<PlayMenuCard>
				<h1>Tournament</h1>
			</PlayMenuCard>
			<PlayMenuCard onClick={() => createMatch("1v1")}>
				<h1>1 v 1</h1>
			</PlayMenuCard>
		</PlayMenuContainer>
	);
};

export default PlayMenu;
