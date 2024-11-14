import React, { useState, useEffect, useCallback } from "react";
import API from "../../../api/api";
import { getUser } from "../../../api/user";
import TwoFactorAuthToggle from "./2FA/TwoFactorAuthToggle";
import TwoFactorAuthSecurity from "./2FA/TwoFactorAuthSecurity";
import ContactInformation from "./ContactInformation";
import SignIn from "./SignIn";
import {
	Form,
	SectionHeading,
} from "../styles/Settings.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import ErrorMessage from "../../../styles/shared/ErrorMessage.styled";
import { useNotification } from "../../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const Security = ({ user, setUser }) => {
	const { addNotification } = useNotification();
	const [formData, setFormData] = useState({
		email: user.email,
		phone_number: user.phone_number || '',
		password: '',
	});
	const [cfPassword, setCfPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [has2FA, setHas2FA] = useState(false);
	const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	useEffect(() => {
		API.get('auth/totp')
			.then(res => {
				setHas2FA(res.data.has_otp);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
			})
	}, [addNotification]);

	const handleChange = useCallback(e => {
		const { id, value } = e.target;

		setFormData(data => ({
			...data,
			[id]: value,
		}));

	}, []);

	const checkSecurityRestrictions = useCallback((data, cfPassword) => {
		const { password, email, phone_number } = data;

		if (password && (new TextEncoder().encode(password).length < 8 || new TextEncoder().encode(password).length > 72)) {
			return t('restrictions.password.invalidLength');
		} else if (password && !/[a-z]/.test(password)) {
			return t('restrictions.password.missingLowercase');
		} else if (password && !/[A-Z]/.test(password)) {
			return t('restrictions.password.missingUppercase');
		} else if  (password && !/\d/.test(password)) {
			return t('restrictions.password.missingDigit');
		} else if (password && !/[\W_]/.test(password)) {
			return t('restrictions.password.missingSpecial');
		} else if (password && password !== cfPassword) {
			return t('restrictions.password.noMatch');
		} else if (email && email.length > 64) {
			return t('restrictions.email.invalidLength');
		} else if (email && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
			return t('restrictions.email.invalidFormat');
		} else if (phone_number && !/^\+[1-9]\d{1,14}$/.test(phone_number)) {
			return t('restrictions.phoneNumber.invalidFormat');
		}

		return '';
	}, [t]);

	const handleSubmit = e => {
		e.preventDefault();
		if (loading) return;

		const submissionData = {};

		['password', 'phone_number', 'email'].forEach(field => {
			if (formData[field] && formData[field] !== user[field] && formData[field].trim() !== '') {
				submissionData[field] = formData[field];
			}
		});

		const errorMessage = checkSecurityRestrictions(submissionData, cfPassword);

		if (errorMessage) {
			setError(errorMessage);
		} else if (Object.keys(submissionData).length > 0 && has2FA) {
			setShowTwoFactorAuth(true);
		} else if (Object.keys(submissionData).length > 0) {
			setLoading(true);
			API.patch('users/@me/profile', submissionData)
				.then(() => {
					addNotification('success', t('settings.security.successMessage'));
					setError('');
					getUser()
						.then(user => {
							setUser(user);
						})
						.catch(err => {
							setError(err?.response?.data?.error || 'An error occurred');
							addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
						});
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred'}`);
				});
		} else {
			addNotification('info', t('settings.security.noChanges'));
		}
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<SectionHeading>{t('settings.security.title')}</SectionHeading>
				<SignIn
					error={error}
					cfPassword={cfPassword}
					setCfPassword={setCfPassword}
					formData={formData}
					handleChange={handleChange}
				/>
				<ContactInformation
					error={error}
					formData={formData}
					handleChange={handleChange}
				/>
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<PongButton type="submit" disabled={loading}>
					{loading ? t('settings.security.loadingButton') : t('settings.security.saveButton')}
				</PongButton>
			</Form>
			<TwoFactorAuthToggle has2FA={has2FA} setHas2FA={setHas2FA}/>
			{showTwoFactorAuth && (
				<TwoFactorAuthSecurity
					formData={formData}
					setUser={setUser}
					setShowTwoFactorAuth={setShowTwoFactorAuth}
					setMainError={setError}
				/>
			)}
		</>
	);
};

export default Security;
