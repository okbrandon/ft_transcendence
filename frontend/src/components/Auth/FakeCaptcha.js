import React from "react";
import { FakeCaptchaContainer } from "./styles/FakeCaptcha.styled";

const FakeCaptcha = () => {
	return (
		<FakeCaptchaContainer>
			<h1>Are you a robot?</h1>
			<p>Click the button below to prove you're not a robot</p>
			<button>Click me!</button>
		</FakeCaptchaContainer>
	);
};

export default FakeCaptcha;
