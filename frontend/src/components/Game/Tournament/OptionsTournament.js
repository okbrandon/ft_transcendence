import React from "react";
import { useNavigate } from "react-router-dom";
import { OptionButton, OptionDescription, TournamentOptionsContainer } from "../../../styles/Game/Tournament/Tournament.styled";

const OptionsTournament = ({ setOptions }) => {
	const navigate = useNavigate();

	return (
		<TournamentOptionsContainer>
			<h1>Select an Option</h1>
			<OptionButton onClick={() => setOptions('create')}>
				Create a Tournament
				<OptionDescription>Start and host a new tournament.</OptionDescription>
			</OptionButton>
			<OptionButton onClick={() => setOptions('join')}>
				Join a Tournament
				<OptionDescription>Enter an existing tournament.</OptionDescription>
			</OptionButton>
			<OptionButton onClick={() => navigate('/playmenu')}>
				<i className="bi bi-arrow-left"/> Back
			</OptionButton>
		</TournamentOptionsContainer>
	);
};

export default OptionsTournament;
