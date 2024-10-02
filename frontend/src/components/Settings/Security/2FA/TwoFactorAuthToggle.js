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
import { useNotification } from "../../../../context/NotificationContext";

const TwoFactorAuthToggle = () => {
	const { addNotification } = useNotification();
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [show2FA, setShow2FA] = useState(false);
	const [qrCodeToken, setQrCodeToken] = useState('');
	const [showQRCode, setShowQRCode] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		API.get('auth/totp')
			.then(res => {
				setIs2FAEnabled(res.data.has_otp);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
			});
	}, [addNotification]);

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
					addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
				});
		}
	};

	return (
		<>
			<SubSectionHeading>Two-Factor Authentication</SubSectionHeading>
			<ToggleContainer>
				<ToggleLabel>{is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</ToggleLabel>
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
					<QRCodeText>Scan this QR code with your authentication app:</QRCodeText>
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
