import React, { useState } from "react";
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
import { useNotification } from "../../../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const TwoFactorAuthToggle = ({ has2FA, setHas2FA }) => {
	const { addNotification } = useNotification();
	const [show2FA, setShow2FA] = useState(false);
	const [qrCodeToken, setQrCodeToken] = useState('');
	const [showQRCode, setShowQRCode] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	const handleToggle = () => {
		if (has2FA) {
			setShow2FA(true);
		} else {
			API.post('auth/totp/enable')
				.then(res => {
					setQrCodeToken(res.data.token);
					setShowQRCode(true);
					setHas2FA(true);
					setError('');
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
				});
		}
	};

	return (
		<>
			<SubSectionHeading>{t('auth.twoFactor.title')}</SubSectionHeading>
			<ToggleContainer>
				<ToggleLabel>{has2FA ? t('auth.twoFactor.disableButton') : t('auth.twoFactor.enableButton')}</ToggleLabel>
				<ToggleSwitch>
				<input
					type="checkbox"
					id="2fa"
					checked={has2FA}
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
					setIs2FAEnabled={setHas2FA}
				/>}
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</>
	);
};

export default TwoFactorAuthToggle;
