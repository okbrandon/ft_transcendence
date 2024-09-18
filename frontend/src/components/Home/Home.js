import React from "react";
import Banner from "./Banner";
import Presentation from "./Presentation";
import Contributors from "./Contributors";
import Features from "./Features";
import Chat from "../Chat/Chat";

const Home = () => {
	return (
		<>
			<Banner/>
			<Presentation/>
			<Features/>
			<Contributors/>
		</>
	);
};

export default Home;
