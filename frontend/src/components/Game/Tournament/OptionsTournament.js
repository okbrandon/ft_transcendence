import React from "react";
import { useNavigate } from "react-router-dom";
import {
	OptionButton,
	TournamentOptionsContainer
} from "../styles/Tournament/Tournament.styled";

const OptionsTournament = ({ setOptions }) => {
	const navigate = useNavigate();

	return (
		<TournamentOptionsContainer>
			<h1>Select an Option</h1>
			<OptionButton onClick={() => setOptions('create')}>
				Create a Tournament
				<p>Start and host a new tournament.</p>
			</OptionButton>
			<OptionButton onClick={() => setOptions('join')}>
				Join a Tournament
				<p>Enter an existing tournament.</p>
			</OptionButton>
			<OptionButton onClick={() => navigate('/playmenu')}>
				<i className="bi bi-arrow-left"/> Back
			</OptionButton>
		</TournamentOptionsContainer>
	);
};

export default OptionsTournament;
