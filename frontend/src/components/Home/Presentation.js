import React, { useEffect, useState } from "react";
import {
	PresentationSection,
	PresentationDiv,
	PongPaddleBackground,
	PongBallBackground,
} from "../../styles/Home/Presentation.styled";

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
		<PresentationSection>
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
