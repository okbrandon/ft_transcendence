import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiSignup } from "../../api/auth";
import {
	Cursor,
	FakeCaptchaContainer,
	FakeCaptchaInput,
	HiddenInput
} from "./styles/FakeCaptcha.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";
import { useNotification } from "../../context/NotificationContext";

const FakeCaptcha = ({ formData, setShowFakeCaptcha, setErrorSignUp }) => {
	const correctText = "I am not a robot";
	const navigate = useNavigate();
	const { addNotification } = useNotification();
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
			ApiSignup(formData)
				.then(() => {
					addNotification('success', 'Account created successfully. Please verify your email.');
					navigate("/signin");
				})
				.catch(err => {
					setErrorSignUp(err?.response?.data?.error || "An error occurred. Please try again.");
					setShowFakeCaptcha(false);
				});
		} else {
			setErrorMessage("Please type the exact phrase: 'I am not a robot'.");
		}
		inputRef.current.focus();
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter') handleSubmit(e);
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
				onKeyDown={handleKeyDown}
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
