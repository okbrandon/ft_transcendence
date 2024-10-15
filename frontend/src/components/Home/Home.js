import React from "react";
import Banner from "./Hero";
import Presentation from "./Presentation";
import Contributors from "./Contributors";
import Features from "./Features";

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
