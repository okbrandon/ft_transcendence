import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiLogin } from "../../api/auth";
import logger from "../../api/logger";
import { AuthContext } from "../../context/AuthContext";
import OTPInputComponent from "./OTPInput";
import { FormContainer } from "./styles/Authentication.styled";
import { AvailablePlatformsContainer, PlatformButton } from "./styles/TwoFactorAuth.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";
import { useNotification } from "../../context/NotificationContext";

const TwoFactorAuthSignIn = ({ username, password, setIsTwoFactorAuth, availablePlatforms }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { setIsLoggedIn } = useContext(AuthContext);
	const [authCode, setAuthCode] = useState("");
	const [disableVerify, setDisableVerify] = useState(!authCode);
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (otpSent) {
			addNotification('success', 'OTP sent successfully');
			setOtpSent(false);
		}
	}, [otpSent, addNotification]);

	const handlePlatform = (platform) => {
		axios.post('http://localhost:8888/api/v1/auth/totp/request', { username, password, platform })
			.then(() => {
				setOtpSent(true);
				logger('2FA: Request sent');
			})
			.catch(err => {
				setError(err?.response?.data?.error || 'An error occurred');
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setDisableVerify(true);
		setError("");

		ApiLogin(username, password, authCode)
			.then(() => {
				setIsLoggedIn(true);
				navigate("/");
			})
			.catch(err => {
				setError(err?.response?.data?.error || 'An error occurred');
			});
	};

	return (
		<>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Two Factor Authentication</h1>
				<p>Enter the 6-digit code generated by your achosen platform.</p>

				<OTPInputComponent setAuthCode={setAuthCode} setDisableVerify={setDisableVerify}/>

				{error && <ErrorMessage>{error}</ErrorMessage>}

				<AvailablePlatformsContainer>
					{availablePlatforms ? availablePlatforms.filter(platform => platform !== 'app').map((platform) => (
						<PlatformButton
							key={platform}
							type="button"
							onClick={() => handlePlatform(platform)}
						>
							{platform === "email" && <i className="bi bi-envelope-fill"/>}
							{platform === "sms" && <i className="bi bi-chat-left-text-fill"/>}
						</PlatformButton>
					)) : (
						<p>No Available Platforms...</p>
					)}
				</AvailablePlatformsContainer>

				<PongButton type="submit" disabled={disableVerify}>
					Verify
				</PongButton>
				<PongButton type="AuthButton" onClick={() => setIsTwoFactorAuth(false)}>
					Back
				</PongButton>
			</FormContainer>
		</>
	);
};

export default TwoFactorAuthSignIn;
