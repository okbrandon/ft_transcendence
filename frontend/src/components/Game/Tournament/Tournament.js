import React, { useState } from "react";
import OptionsTournament from "./OptionsTournament";
import CreateTournament from "./CreateTournament";
import AvailableTournaments from "./AvailableTournament";
import { SpectateResultsContainer } from "../styles/Game.styled";
import { useAuth } from "../../../context/AuthContext";

const Tournament = () => {
	const [options, setOptions] = useState('');
	// const { user } = useAuth();

	return (
		<>
			{!options && <OptionsTournament setOptions={setOptions}/>}
			{options === 'create' && <CreateTournament setOptions={setOptions}/>}
			{options === 'join' && <AvailableTournaments setOptions={setOptions}/>}
		</>
	);
	// return (
	// 	<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100wv'}}>
	// 		<SpectateResultsContainer>
	// 			<img src={user.avatarID} alt="avatar"/>
	// 			{user.displayName} won !
	// 		</SpectateResultsContainer>
	// 	</div>
	// )
};

export default Tournament;
