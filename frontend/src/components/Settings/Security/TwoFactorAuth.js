import React, { useEffect, useState } from "react";
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

const TwoFactorAuth = ({ user }) => {
	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [qrCodeToken, setQrCodeToken] = useState('');
	const [showQRCode, setShowQRCode] = useState(user.mfaToken ? true : false);
	const [error, setError] = useState('');

	useEffect(() => {
		API.get('auth/totp')
			.then((res) => {
				setIs2FAEnabled(res.data.has_otp);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	const handleToggle = () => {
		if (is2FAEnabled) {
			const enteredCode = window.prompt('Please enter your current 2FA code to disable it:'); // change this
			if (enteredCode) {
				API.post('auth/totp/delete', { otp: enteredCode })
					.then(() => {
						setShowQRCode(false);
						setIs2FAEnabled(false);
						setError('');
					})
					.catch((err) => {
						setError(err.response.data.error);
					});
			}
		} else {
			API.post('auth/totp/enable')
				.then((res) => {
					setQrCodeToken(res.data.token);
					setShowQRCode(true);
					setIs2FAEnabled(true);
					setError('');
				})
				.catch((err) => {
					setError(err.response.data.error);
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
