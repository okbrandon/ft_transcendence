import React, { useState } from "react";
import OptionsTournament from "./OptionsTournament";
import CreateTournament from "./CreateTournament";
import AvailableTournaments from "./AvailableTournament";
import EndedTournament from "./EndedTournament";

const Tournament = () => {
	const [options, setOptions] = useState('');

	return (
		<>
			<EndedTournament />
			{/* {!options && <OptionsTournament setOptions={setOptions}/>}
			{options === 'create' && <CreateTournament setOptions={setOptions}/>}
			{options === 'join' && <AvailableTournaments setOptions={setOptions}/>} */}
		</>
	);
};

export default Tournament;
