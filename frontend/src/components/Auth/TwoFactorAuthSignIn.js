import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { apiLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import OTPInputComponent from "./OTPInput";
import { FormContainer, Outline } from "./styles/Authentication.styled";
import { AvailablePlatformsContainer, PlatformButton } from "./styles/TwoFactorAuth.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";

const TwoFactorAuthSignIn = ({ username, password, setIsTwoFactorAuth, availablePlatforms }) => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { setIsLoggedIn } = useAuth();
	const [authCode, setAuthCode] = useState("");
	const [disableVerify, setDisableVerify] = useState(!authCode);
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState("");
	const { t } = useTranslation();
	const tRef = useRef(t);

	useEffect(() => {
		if (!otpSent) return;
		addNotification('info', tRef.current('auth.twoFactor.successMessage'));
		const timeout = setTimeout(() => {
			setOtpSent(false);
		}, 5000);
		return () => clearTimeout(timeout);
	}, [otpSent, addNotification]);

	const handlePlatform = platform => {
		if (otpSent) return;
		axios.post(process.env.REACT_APP_ENV === 'production' ? '/api/v1/auth/totp/request' : 'http://localhost:8000/api/v1/auth/totp/request', { username, password, platform })
			.then(() => {
				setOtpSent(true);
			})
			.catch(err => {
				setError(err?.response?.data?.error || 'An error occurred');
			});
	};

	const handleSubmit = e => {
		e.preventDefault();
		setDisableVerify(true);
		setError("");

		apiLogin(username, password, authCode)
			.then(() => {
				setIsLoggedIn(true);
				navigate("/");
			})
			.catch(err => {
				addNotification("error", err?.response?.data?.error || "An error occurred");
			});
	};

	return (
		<Outline>
			<div className="card">
				<div className="card2">
					<FormContainer onSubmit={handleSubmit}>
						<h1>{t('auth.twoFactor.title')}</h1>
						<p>{t('auth.twoFactor.subTitle')}</p>

						<OTPInputComponent setAuthCode={setAuthCode} setDisableVerify={setDisableVerify}/>

						{error && <ErrorMessage>{error}</ErrorMessage>}

						<AvailablePlatformsContainer>
							{availablePlatforms ? availablePlatforms.filter(platform => platform !== 'app').map((platform) => (
								<PlatformButton
									key={platform}
									type="button"
									onClick={() => handlePlatform(platform)}
									disabled={otpSent}
								>
									{platform === "email" && <i className="bi bi-envelope-fill"/>}
									{platform === "sms" && <i className="bi bi-chat-left-text-fill"/>}
								</PlatformButton>
							)) : (
								<p>{t('auth.twoFactor.noAvailablePlatform')}</p>
							)}
						</AvailablePlatformsContainer>

						<PongButton type="submit" disabled={disableVerify}>
							{t('auth.twoFactor.verifyButton')}
						</PongButton>
						<PongButton type="AuthButton" onClick={() => setIsTwoFactorAuth(false)}>
							{t('auth.twoFactor.backButton')}
						</PongButton>
					</FormContainer>
				</div>
			</div>
		</Outline>
	);
};

export default TwoFactorAuthSignIn;
