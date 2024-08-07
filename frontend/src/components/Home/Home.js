import React from "react";
import Banner from "./Banner";
import NavBar from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import Presentation from "./Presentation";

const Home = () => {
	return (
		<>
			<NavBar/>
			<main>
				<Banner/>
				<Presentation/>
			</main>
			<Footer/>
		</>
	);
};

export default Home;
