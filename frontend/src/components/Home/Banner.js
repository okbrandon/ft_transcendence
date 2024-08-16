import React from "react";
import { useNavigate } from "react-router-dom";
import { BannerSection, BannerPaddles } from "../../styles/Home/Banner.styled";
import PongButton from "../../styles/shared/button/PongButton.styled";
import { motion } from 'framer-motion';

const Banner = () => {
	const navigate = useNavigate();

	return (
		<BannerSection>
			<BannerPaddles/>
			<h1>GET READY TO SERVE!</h1>
			<motion.div
				whileHover={{ scale: [null, 1.10, 1.08] }}
				transition={{ duration: 0.3 }}
			>
				<PongButton variant="light" onClick={() => navigate("/solo-vs-ai")}>
					PLAY NOW
				</PongButton>
			</motion.div>
		</BannerSection>
	);
};

export default Banner;
