import React from "react";
import BannerSection from "../../styles/layouts/BannerSection.styled";
import BannerPaddles from "../../styles/animations/BannerBackground.styled";

const Banner = () => {
	return (
		<BannerSection>
			<BannerPaddles/>
			<h1>GET READY TO SERVE!</h1>
			<h2>PLAY NOW</h2>
		</BannerSection>
	);
};

export default Banner;
