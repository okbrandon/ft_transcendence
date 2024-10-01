import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiLogin } from "../../api/auth";
import logger from "../../api/logger";
import { AuthContext } from "../../context/AuthContext";
import Notification from "../Notification/Notification";
import OTPInputComponent from "./OTPInput";
import { FormContainer } from "./styles/Authentication.styled";
import { AvailablePlatformsContainer, PlatformButton } from "./styles/TwoFactorAuth.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import ErrorMessage from "../../styles/shared/ErrorMessage.styled";
import { useTranslation } from "react-i18next";

const TwoFactorAuthSignIn = ({ username, password, setIsTwoFactorAuth, availablePlatforms }) => {
	const navigate = useNavigate();
	const notificationRef = useRef(null);
	const { setIsLoggedIn } = useContext(AuthContext);
	const [authCode, setAuthCode] = useState("");
	const [disableVerify, setDisableVerify] = useState(!authCode);
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState("");
	const { t } = useTranslation();

	useEffect(() => {
		if (otpSent && notificationRef.current) {
			notificationRef.current.addNotification(
				'info',
				t('auth.twoFactor.successMessage')
			);
			setOtpSent(false);
		}
	}, [otpSent]);

	const handlePlatform = (platform) => {
		axios.post('/api/v1/auth/totp/request', { username, password, platform })
			.then(() => {
				setOtpSent(true);
				logger('2FA: Request sent');
			})
			.catch(err => {
				logger('2FA: Request failed');
				setError(err.response.data.error);
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
			.catch((err) => {
				setError(err.response.data.error);
			});
	};

	return (
		<>
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
			<Notification ref={notificationRef}/>
		</>
	);
};

export default TwoFactorAuthSignIn;
