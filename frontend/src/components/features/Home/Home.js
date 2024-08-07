import React, { useState } from "react";
import Navigation from "../../features/Navigation/Navigation";
import Banner from "./Banner";
import Footer from "../Footer/Footer";
import Presentation from "./Presentation";

const Home = () => {
	const [showFriends, setShowFriends] = useState(false);

	const handleFriends = () => {
		setShowFriends(!showFriends);
	};

	return (
		<>
			<Navigation handleFriends={handleFriends}/>
			<main>
				<Banner/>
				<Presentation/>
			</main>
			<Footer/>
		</>
	);
};

export default Home;
