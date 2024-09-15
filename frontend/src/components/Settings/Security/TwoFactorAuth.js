import React, { useState } from "react";
import {
	AuthCodeInput,
	QRCodeWrapper,
	Slider,
	ToggleContainer,
	ToggleLabel,
	ToggleSwitch,
	TwoFAContainer,
	TwoFAText,
	VerifyButton
} from "../styles/TwoFactorAuth.styled";
import QRCode from "react-qr-code";
import API from "../../../api/api";
import { ErrorMessage, SuccessMessage } from "../styles/Settings.styled";

const TwoFactorAuth = ({ user, handleChange }) => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(user.mfaToken ? true : false);
	const [qrCodeToken, setQrCodeToken] = useState(''); // Store the token to generate the QR code
	const [authCode, setAuthCode] = useState(''); // Store the authentication code entered by the user
	const [showQRCode, setShowQRCode] = useState(false); // Control when to show QR code
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	// Handle enabling/disabling 2FA
	const handleToggle = () => {
		if (is2FAEnabled) {
		  // User wants to disable 2FA, ask for the current 2FA code
		  const enteredCode = window.prompt('Please enter your current 2FA code to disable it:');
		  if (enteredCode) {
			API.post('auth/totp/delete', { code: enteredCode })
			.then(() => {
				setIs2FAEnabled(false);
				setSuccess('2FA has been disabled.');
				setError('');
			})
			.catch((err) => {
				setError('Failed to disable 2FA. Please try again.');
				setSuccess('');
			});
		  }
		} else {
			// User wants to enable 2FA, request the QR code token from the backend
			API.post('auth/totp/enable')
				.then((res) => {
					const { token } = res.data;
					console.log('Token:', token);
					setQrCodeToken(token); // Save the token to render QR code
					setShowQRCode(true); // Show the QR code for the user to scan
					setError('');
				})
				.catch((err) => {
					setError('Failed to enable 2FA. Please try again.');
					setSuccess('');
				});
		}
	  };

	  // Verify the 2FA code entered by the user
	const verify2FACode = () => {
		if (authCode) {
			API.post('auth/totp/confirm', { code: authCode })
				.then(() => {
					setIs2FAEnabled(true); // Set 2FA as enabled
					setShowQRCode(false); // Hide the QR code after verification
					setAuthCode(''); // Clear the authentication code field
					setSuccess('2FA has been enabled successfully.');
					setError('');
				})
				.catch((err) => {
					setError('Invalid code. Please try again.');
					setSuccess('');
				});
		} else {
			setError('Please enter the authentication code.');
		}
	};

	return (
		<>
			<ToggleContainer>
				<ToggleLabel>{is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</ToggleLabel>
				<ToggleSwitch>
				<input type="checkbox" checked={is2FAEnabled} onChange={handleToggle} />
				<Slider/>
				</ToggleSwitch>
			</ToggleContainer>

			{showQRCode && (
				<TwoFAContainer>
					<TwoFAText>Scan this QR code with your authentication app:</TwoFAText>
					<QRCodeWrapper>
						<QRCode value={`otpauth://totp/Pong%20Account?secret=${qrCodeToken}&issuer=Pong`}/>
					</QRCodeWrapper>
					<TwoFAText>Enter the authentication code from your app to enable 2FA:</TwoFAText>
					<AuthCodeInput
						type="text"
						placeholder="Enter the authentication code"
						value={authCode}
						onChange={(e) => setAuthCode(e.target.value)}
					/>
					<VerifyButton onClick={verify2FACode}>Verify Code</VerifyButton>
				</TwoFAContainer>
			)}

			{/* Show success or error messages */}
			{success && <SuccessMessage>{success}</SuccessMessage>}
			{error && <ErrorMessage>{error}</ErrorMessage>}
    	</>
	);
};

export default TwoFactorAuth;
