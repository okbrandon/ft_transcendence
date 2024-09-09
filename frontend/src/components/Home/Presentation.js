import React, { useEffect, useState, useRef } from "react";
import {
	PresentationSection,
	PresentationContent,
	PongPaddleBackground,
	PongBallBackground,
	PongElementsBackground,
} from "./styles/Presentation.styled";

const slideInLeft = {
	hidden: {
		left: '-150px',
		opacity: 0
	},
	visible: {
		left: '-50px',
		opacity: 1,
		transition: { duration: 1 }
	},
	exit: {
		left: '-150px',
		opacity: 0
	},
};

const slideInRight = {
	hidden: {
		right: "-50px",
		opacity: 0
	},
	visible: {
		right: '150px',
		opacity: 1,
		transition: { duration: 1 }
	},
	exit: {
		right: "-50px",
		opacity: 0
	},
}


const Presentation = () => {
	const [visible, setVisible] = useState(false);
	const presentationRef = useRef(null);

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
				<h1>Welcome to Pong!</h1>
				<p>Pong is a classic arcade game that has been a favorite among gamers for decades.</p>
				<p>Now, you can enjoy this timeless game right here on our platform with enhanced features, multiplayer support, and online
				tournaments.</p>
			</PresentationContent>
			<PongElementsBackground>
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
			</PongElementsBackground>
		</PresentationSection>
	);
};

export default Presentation;
