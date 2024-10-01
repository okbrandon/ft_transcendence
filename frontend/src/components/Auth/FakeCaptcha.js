import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Cursor,
	FakeCaptchaContainer,
	FakeCaptchaInput,
	HiddenInput
} from "./styles/FakeCaptcha.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";

const FakeCaptcha = () => {
	const correctText = "I am not a robot";
	const navigate = useNavigate();
	const inputRef = useRef(null);
	const [inputValue, setInputValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [cursorIndex, setCursorIndex] = useState(0);

	const handleInputChange = e => {
		const value = e.target.value;
		setInputValue(value);
		setCursorIndex(value.length);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (inputValue === correctText) {
			navigate('/login/send-email-notification');
		} else {
			setErrorMessage("Please type the exact phrase: 'I am not a robot'.");
		}
		inputRef.current.focus();
	};

	const renderTypingFeedback = () => {
		return correctText.split("").map((char, index) => {
			let color;
			if (inputValue[index] === undefined) {
				color = "gray";
			} else if (inputValue[index] === char) {
				color = "green";
			} else {
				color = "red";
			}
			return (
				<span key={index} style={{ color }}>
					{cursorIndex === index && <Cursor/>}
					{char}
				</span>
			);
		});
	};

	return (
		<FakeCaptchaContainer>
			<h1>Are you a robot?</h1>
			<p>Type the following text to prove you're not a robot:</p>
			<FakeCaptchaInput>
				{renderTypingFeedback()}
			</FakeCaptchaInput>
			<HiddenInput
				id="fake-captcha"
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				maxLength={correctText.length}
				ref={inputRef}
				autoFocus
			/>
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
			<PongButton onClick={e => handleSubmit(e)}>Submit</PongButton>
		</FakeCaptchaContainer>
	);
};

export default FakeCaptcha;
