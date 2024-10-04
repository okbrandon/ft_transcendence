import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import TwoFactorAuthDeactivate from "./TwoFactorAuthDeactivate";
import API from "../../../../api/api";
import {
	QRCodeWrapper,
	Slider,
	ToggleContainer,
	ToggleLabel,
	ToggleSwitch,
	QRCodeContainer,
	QRCodeText,
} from "../../styles/TwoFactorAuthToggle.styled";
import { SubSectionHeading } from "../../styles/Settings.styled";
import ErrorMessage from "../../../../styles/shared/ErrorMessage.styled";
import { useTranslation } from "react-i18next";

const TwoFactorAuthToggle = () => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [show2FA, setShow2FA] = useState(false);
	const [qrCodeToken, setQrCodeToken] = useState('');
	const [showQRCode, setShowQRCode] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		API.get('auth/totp')
			.then(res => {
				setIs2FAEnabled(res.data.has_otp);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	const handleToggle = () => {
		if (is2FAEnabled) {
			setShow2FA(true);
		} else {
			API.post('auth/totp/enable')
				.then(res => {
					setQrCodeToken(res.data.token);
					setShowQRCode(true);
					setIs2FAEnabled(true);
					setError('');
				})
				.catch(err => {
					setError(err.response.data.error);
				});
		}
	};

	return (
		<>
			<SubSectionHeading>{t('auth.twoFactor.title')}</SubSectionHeading>
			<ToggleContainer>
				<ToggleLabel>{is2FAEnabled ? t('auth.twoFactor.disableButton') : t('auth.twoFactor.enableButton')}</ToggleLabel>
				<ToggleSwitch>
				<input
					type="checkbox"
					id="2fa"
					checked={is2FAEnabled}
					onChange={handleToggle}
				/>
				<Slider/>
				</ToggleSwitch>
			</ToggleContainer>

			{showQRCode && (
				<QRCodeContainer>
					<QRCodeText>{t('auth.twoFactor.scanMessage')}</QRCodeText>
					<QRCodeWrapper>
						<QRCode value={`otpauth://totp/Pong%20Account?secret=${qrCodeToken}&issuer=Pong`}/>
					</QRCodeWrapper>
				</QRCodeContainer>
			)}

			{show2FA &&
				<TwoFactorAuthDeactivate
					setShow2FA={setShow2FA}
					setShowQRCode={setShowQRCode}
					setIs2FAEnabled={setIs2FAEnabled}
				/>}
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</>
	);
};

export default TwoFactorAuthToggle;
