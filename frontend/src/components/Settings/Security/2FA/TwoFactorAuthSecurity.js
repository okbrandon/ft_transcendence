import React, { useCallback, useEffect, useState } from 'react';
import API from '../../../../api/api';
import { getUser } from '../../../../api/user';
import OTPInputComponent from '../../../Auth/OTPInput';
import { AvailablePlatformsContainer, PlatformButton } from '../../../Auth/styles/TwoFactorAuth.styled';
import { Backdrop, FormContainer } from '../../styles/TwoFactorAuth.styled';
import PongButton from '../../../../styles/shared/PongButton.styled';
import ErrorMessage from '../../../../styles/shared/ErrorMessage.styled';
import { useNotification } from '../../../../context/NotificationContext';
import { useTranslation } from 'react-i18next';

const TwoFactorAuthSecurity = ({ formData, setUser, setShowTwoFactorAuth, setMainError }) => {
	const { addNotification } = useNotification();
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
				addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
			});
	}, [addNotification]);

	const handlePlatform = useCallback(platform => {
		API.post('auth/totp/request', { platform })
			.then(() => {
				addNotification('success', t('auth.twoFactor.requestSent'));
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
			});
	}, [addNotification, t]);

	const handleSubmit = e => {
		e.preventDefault();
		setDisableVerify(true);
		setError('');

		const submissionData = { ...formData };

		['password', 'phone_number', 'email'].forEach(field => {
			if (!submissionData[field]) {
				delete submissionData[field];
			}
		});

		API.patch('users/@me/profile', { ...submissionData, otp: authCode })
			.then(() => {
				addNotification('success', t('settings.security.successMessage'));
				setMainError('');
				getUser()
					.then(res => {
						setUser(res);
					})
					.catch(err => {
						setError(err.response.data.error);
					});
				setShowTwoFactorAuth(false);
			})
			.catch(err => {
				setError(err.response.data.error);
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
