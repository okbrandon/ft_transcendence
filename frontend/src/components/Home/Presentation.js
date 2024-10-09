import React, { useEffect, useState, useRef } from "react";
import {
	PresentationSection,
	PresentationContent,
	PongPaddleBackground,
	PongBallBackground,
	PongElementsBackground,
} from "./styles/Presentation.styled";
import { useTranslation } from "react-i18next";

const Presentation = () => {
	const [visible, setVisible] = useState(false);
	const presentationRef = useRef(null);
	const { t } = useTranslation();

	const handleScroll = () => {
		const rect = presentationRef.current.getBoundingClientRect();
		const offset = window.innerHeight / 2;
		const isInView = rect.top < offset && rect.bottom > offset;
		setVisible(isInView);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<PresentationSection ref={presentationRef}>
			<PresentationContent>
				<h1>{t('home.presentation.title')}</h1>
				<p>{t('home.presentation.description.firstParagraph')}</p>
				<p>{t('home.presentation.description.secondParagraph')}</p>
			</PresentationContent>
			<PongElementsBackground>
				<PongPaddleBackground className={visible ? "visible" : ""}/>
				<PongBallBackground className={visible ? "visible" : ""}/>
			</PongElementsBackground>
		</PresentationSection>
	);
};

export default Presentation;
