import React, { useState } from "react";
import {
	QRCodeWrapper,
	Slider,
	ToggleContainer,
	ToggleLabel,
	ToggleSwitch,
	TwoFAContainer,
	TwoFAText,
} from "../styles/TwoFactorAuth.styled";
import QRCode from "react-qr-code";
import API from "../../../api/api";
import { ErrorMessage } from "../styles/Settings.styled";

const TwoFactorAuth = ({ user, handleChange }) => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(user.mfaToken ? true : false);
	const [qrCodeToken, setQrCodeToken] = useState(''); // Store the token to generate the QR code
	const [showQRCode, setShowQRCode] = useState(user.mfaToken ? true : false); // Control when to show QR code
	const [error, setError] = useState('');

	// Handle enabling/disabling 2FA
	const handleToggle = () => {
		if (is2FAEnabled) {
			// User wants to disable 2FA, ask for the current 2FA code
			const enteredCode = window.prompt('Please enter your current 2FA code to disable it:');
			if (enteredCode) {
				API.post('auth/totp/delete', { code: enteredCode })
					.then(() => {
						handleChange({ target: { id: 'mfaToken', value: '' }});
						setShowQRCode(false);
						setIs2FAEnabled(false);
						setError('');
					})
					.catch((err) => {
						setError(err.response.data.error);
					});
			}
		} else {
			// User wants to enable 2FA, request the QR code token from the backend
			API.post('auth/totp/enable')
				.then((res) => {
					setQrCodeToken(res.data);
					handleChange({ target: { id: 'mfaToken', value: res.data } });
					setShowQRCode(true);
					setIs2FAEnabled(true);
					setError('');
				})
				.catch((err) => {
					setError('Failed to enable 2FA. Please try again.');
				});
		}
	};

	return (
		<>
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
				<TwoFAContainer>
					<TwoFAText>Scan this QR code with your authentication app:</TwoFAText>
					<QRCodeWrapper>
						<QRCode value={`otpauth://totp/Pong%20Account?secret=${qrCodeToken}&issuer=Pong`}/>
					</QRCodeWrapper>
				</TwoFAContainer>
			)}

			{error && <ErrorMessage>{error}</ErrorMessage>}
		</>
	);
};

export default TwoFactorAuth;
