import React, { useState } from "react";
import OptionsTournament from "./OptionsTournament";
import CreateTournament from "./CreateTournament";
import AvailableTournaments from "./AvailableTournament";

const Tournament = () => {
	const [options, setOptions] = useState('');

	return (
		<>
			{!options && <OptionsTournament setOptions={setOptions}/>}
			{options === 'create' && <CreateTournament setOptions={setOptions}/>}
			{options === 'join' && <AvailableTournaments setOptions={setOptions}/>}
		</>
	);
};

export default Tournament;
