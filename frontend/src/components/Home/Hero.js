import React from "react";
import { useNavigate } from "react-router-dom";
import {
	HeroPaddle,
	HeroPaddlesContainer,
	HeroSection,
	PlayButton,
} from "./styles/Hero.styled";
import { useTranslation } from "react-i18next";

const Hero = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<>
			<HeroSection>
				<HeroPaddlesContainer>
					<HeroPaddle
						$left={10}
						$blurPx={2}
						$rotation={30}
						$scale={0.9}
						$direction={360}
						$animationDuration={23}
					/>
					<HeroPaddle
						$left={30}
						$blurPx={4}
						$rotation={10}
						$scale={0.7}
						$direction={-360}
						$animationDuration={10}
					/>
					<HeroPaddle
						$left={50}
						$blurPx={6}
						$rotation={85}
						$scale={1}
						$direction={360}
						$animationDuration={16}
					/>
					<HeroPaddle
						$left={70}
						$blurPx={8}
						$rotation={55}
						$scale={1.2}
						$direction={-360}
						$animationDuration={22}
					/>
					<HeroPaddle
						$left={90}
						$blurPx={10}
						$rotation={10}
						$scale={0.6}
						$direction={360}
						$animationDuration={11}
					/>
				</HeroPaddlesContainer>
				<h1>{t('home.welcome')}</h1>
				<PlayButton variant="light" onClick={() => navigate("/playmenu")}>
					{t('home.playButton')}
				</PlayButton>
			</HeroSection>
		</>
	);
};

export default Hero;
