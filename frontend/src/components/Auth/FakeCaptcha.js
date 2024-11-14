import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiSignup } from "../../api/auth";
import {
	Cursor,
	FakeCaptchaContainer,
	FakeCaptchaInput,
	HiddenInput
} from "./styles/FakeCaptcha.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const FakeCaptcha = ({ formData, setShowFakeCaptcha, setErrorSignUp }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const inputRef = useRef(null);
	const [inputValue, setInputValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [cursorIndex, setCursorIndex] = useState(0);
	const { t } = useTranslation();
	const correctText = t('auth.fakeCaptcha.phrase');

	const handleInputChange = e => {
		const value = e.target.value;
		setInputValue(value);
		setCursorIndex(value.length);
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (inputValue === correctText) {
			apiSignup(formData)
				.then(() => {
					addNotification('success', t('auth.fakeCaptcha.successMessage'));
					navigate("/signin");
				})
				.catch(err => {
					setErrorSignUp(err?.response?.data?.error || "An error occurred. Please try again.");
					setShowFakeCaptcha(false);
				});
		} else {
			setErrorMessage(t('auth.fakeCaptcha.errorMessage'));
		}
		inputRef.current.focus();
		setInputValue("");
		setCursorIndex(0);
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
			} else if (char === " " && inputValue[index] !== char) {
				color = "bg-red";
			} else {
				color = "red";
			}

			if (color === "bg-red") {
				return (
					<span key={index} style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }}>
						{cursorIndex === index && <Cursor/>}
						{char}
					</span>
				);
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
			<i className="bi bi-arrow-left" onClick={() => setShowFakeCaptcha(false)}/>
			<h1>{t('auth.fakeCaptcha.title')}</h1>
			<p>{t('auth.fakeCaptcha.subTitle')}</p>
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
			<PongButton onClick={e => handleSubmit(e)}>{t('auth.fakeCaptcha.submitButton')}</PongButton>
		</FakeCaptchaContainer>
	);
};

export default FakeCaptcha;
