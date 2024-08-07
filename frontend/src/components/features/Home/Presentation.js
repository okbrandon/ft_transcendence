import React from "react";
import { PongBallBackground, PongPaddleBackground } from "../../styles/animations/PongBackground.styled";
import PresentationDiv from "../../styles/layouts/PresentationDiv.styled";
import PresentationSection from "../../styles/layouts/PresentationSection.styled";

const Presentation = () => {
	return (
		<PresentationSection height='700px'>
			<PongPaddleBackground/>
			<PongBallBackground/>
			<PresentationDiv>
				<h1>Welcome to Pong!</h1>
				<p>Pong is a classic arcade game that has been a favorite among gamers for decades.</p>
				<p>Now, you can enjoy this timeless game right here on our platform!</p>
			</PresentationDiv>
		</PresentationSection>
	);
};

export default Presentation;
