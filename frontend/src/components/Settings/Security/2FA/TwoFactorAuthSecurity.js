import React, { useEffect, useState } from 'react';
import API from '../../../../api/api';
import logger from '../../../../api/logger';
import { GetUser } from '../../../../api/user';
import OTPInputComponent from '../../../Auth/OTPInput';
import { AvailablePlatformsContainer, PlatformButton } from '../../../Auth/styles/TwoFactorAuth.styled';
import { Backdrop, FormContainer } from '../../styles/TwoFactorAuth.styled';
import PongButton from '../../../../styles/shared/PongButton.styled';
import ErrorMessage from '../../../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';

const TwoFactorAuthSecurity = ({ formData, setUser, setSuccess, setShowTwoFactorAuth }) => {
	const [availablePlatforms, setAvailablePlatforms] = useState([]);
	const [authCode, setAuthCode] = useState('');
	const [disableVerify, setDisableVerify] = useState(true);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		API.get('auth/totp/platform_availability')
			.then(res => {
				setAvailablePlatforms(res.data.available_platforms);
			})
			.catch(err => {
				setError(err.response.data.error);
			});
	}, []);

	const handlePlatform = platform => {
		API.post('auth/totp/request', { platform })
			.then(() => {
				logger('2FA: Request sent');
			})
			.catch(err => {
				logger('2FA: Request failed');
				setError(err.response?.data?.error || 'An error occurred');
			});
	};

	const handleSubmit = e => {
		e.preventDefault();
		setDisableVerify(true);
		setError('');

		const submissionData = { ...formData };

		API.patch('users/@me/profile', { ...submissionData, otp: authCode })
			.then(() => {
				logger('2FA: Success');
				setSuccess('Security updated successfully');
				GetUser()
					.then(res => {
						setUser(res.data);
						logger('User data refetched and updated in context:', res.data);
					})
					.catch(err => {
						setError(err.response.data.error);
						setSuccess('');
					});
				setShowTwoFactorAuth(false);
			})
			.catch(err => {
				setError(err.response.data.error);
				setSuccess('');
			})
			.finally(() => {
				setDisableVerify(false);
			});
	};

	return (
		<>
			<Backdrop/>
			<FormContainer onSubmit={handleSubmit}>
				<h1>{t('auth.twoFactor.title')}</h1>
				<p>{t('auth.twoFactor.subTitle')}</p>

				<OTPInputComponent setAuthCode={setAuthCode} setDisableVerify={setDisableVerify}/>

				{error && <ErrorMessage>{error}</ErrorMessage>}

				<AvailablePlatformsContainer>
					{availablePlatforms ? availablePlatforms.filter(platform => platform !== 'app').map(platform => (
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

				<PongButton type="button" onClick={() => setShowTwoFactorAuth(false)}>
					{t('auth.twoFactor.backButton')}
				</PongButton>
			</FormContainer>
		</>
	);
};

export default TwoFactorAuthSecurity;
