import React, { useState } from "react";
import Navigation from "../../features/Navigation/Navigation";

const Home = () => {
	const [showFriends, setShowFriends] = useState(false);

	const handleFriends = () => {
		setShowFriends(!showFriends);
	};

	return (
		<>
			<Navigation handleFriends={handleFriends}/>
		</>
	);
};

export default Home;
