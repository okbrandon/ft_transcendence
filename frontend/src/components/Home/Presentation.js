import React, { useEffect, useState, useRef } from "react";
import {
	PresentationSection,
	PresentationDiv,
	PongPaddleBackground,
	PongBallBackground,
	FeaturesContainer,
	FeatureItem,
} from "../../styles/Home/Presentation.styled";

const slideInLeft = {
	hidden: { left: '-20rem', opacity: 0 },
	visible: { left: '-3rem', opacity: 1, transition: { duration: 1 } },
	exit: { left: '-20rem', opacity: 0 },
};

const slideInRight = {
	hidden: { right: 0, opacity: 0 },
	visible: { right: '18rem', opacity: 1, transition: { duration: 1 } },
	exit: { right: 0, opacity: 0 },
};

const Presentation = () => {
	const [visible, setVisible] = useState(false);
	const presentationRef = useRef(null);

	const handleScroll = () => {
		const rect = presentationRef.current.getBoundingClientRect();
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
			<PresentationDiv ref={presentationRef}>
				<h1>Welcome to Pong!</h1>
				<p>Pong is a classic arcade game that has been a favorite among gamers for decades.</p>
				<p>Now, you can enjoy this timeless game right here on our platform with enhanced features, multiplayer support, and online
				tournaments.</p>
				<FeaturesContainer>
					<FeatureItem>
						<h3>Multiplayer Mode</h3>
						<p>Challenge your friends or compete against other players in real-time multiplayer mode.</p>
					</FeatureItem>
					<FeatureItem>
						<h3>Leaderboards</h3>
						<p>Climb the global leaderboard and prove that you're the ultimate Pong master!</p>
					</FeatureItem>
					<FeatureItem>
						<h3>Exclusive Skins</h3>
						<p>Unlock custom paddles and ball designs to stand out in every match.</p>
					</FeatureItem>
				</FeaturesContainer>
			</PresentationDiv>
		</PresentationSection>
	);
};

export default Presentation;
