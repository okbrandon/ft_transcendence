import React, { useEffect, useState } from "react";
import { PongBallBackground, PongPaddleBackground } from "../../styles/animations/PongBackground.styled";
import PresentationDiv from "../../styles/layouts/PresentationDiv.styled";
import PresentationSection from "../../styles/layouts/PresentationSection.styled";
import { motion } from "framer-motion";

const slideInLeft = {
	hidden: { left: '-300px', opacity: 0 },
	visible: { left: '-50px', opacity: 1, transition: { duration: 1 } },
	exit: { left: '-300px', opacity: 0 },
};

const slideInRight = {
	hidden: { right: 0, opacity: 0 },
	visible: { right: '300px', opacity: 1, transition: { duration: 1 } },
	exit: { right: 0, opacity: 0 },
};

const fadeIn = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 1 } },
	exit: { opacity: 0, y: 50},
};

const Presentation = () => {
	const [visible, setVisible] = useState(false);

	const handleScroll = () => {
		const div = document.getElementById('presentation-div');
		const rect = div.getBoundingClientRect();
		const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
		setVisible(isInView);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<PresentationSection height='700px'>
			<PongPaddleBackground
				initial="hidden"
				animate={visible ? "visible" : "hidden"}
				variants={slideInLeft}
			/>
			<PongBallBackground
				initial="hidden"
				animate={visible ? "visible" : "hidden"}
				variants={slideInRight}
			/>
			<PresentationDiv id="presentation-div">
				<h1>Welcome to Pong!</h1>
				<p>Pong is a classic arcade game that has been a favorite among gamers for decades.</p>
				<p>Now, you can enjoy this timeless game right here on our platform!</p>
			</PresentationDiv>
		</PresentationSection>
	);
};

export default Presentation;
