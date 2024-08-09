import React from "react";
import { useNavigate } from "react-router-dom";
import { BannerSection, BannerPaddles } from "../../styles/Banner.styled";
import PongButton from "../tmp/PongButton";

const Banner = () => {
	const navigate = useNavigate();

	return (
		<BannerSection>
			<BannerPaddles/>
			<h1>GET READY TO SERVE!</h1>
			<PongButton title="PLAY NOW" variant="light" onClick={() => navigate("/solo-vs-ai")}/>
		</BannerSection>
	);
};

export default Banner;
