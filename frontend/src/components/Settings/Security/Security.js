import React, { useState, useEffect } from "react";
import API from "../../../api/api";
import { GetUser } from "../../../api/user";
import TwoFactorAuthToggle from "./2FA/TwoFactorAuthToggle";
import TwoFactorAuthSecurity from "./2FA/TwoFactorAuthSecurity";
import ContactInformation from "./ContactInformation";
import SignIn from "./SignIn";
import {
	Form,
	SectionHeading,
	SuccessMessage
} from "../styles/Settings.styled";
import PongButton from "../../../styles/shared/PongButton.styled";
import ErrorMessage from "../../../styles/shared/ErrorMessage.styled";
import { useTranslation } from "react-i18next";

const Security = ({ user, setUser }) => {
	const [formData, setFormData] = useState({
		email: user.email,
		phone_number: user.phone_number || '',
		password: '',
	});
	const [cfPassword, setCfPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [has2FA, setHas2FA] = useState(false);
	const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	useEffect(() => {
		API.get('auth/totp')
			.then(res => {
				setHas2FA(res.data.has_otp);
			})
			.catch(err => {
				console.error(err.response.data.error);
			})
	}, []);

	const handleChange = e => {
		const { id, value } = e.target;

		setFormData(data => ({
			...data,
			[id]: value,
		}));
	};

	const checkSecurityRestrictions = (data, cfPassword) => {
		if (!data) {
			return '';
		}

		if (data.password && (new TextEncoder().encode(data.password).length < 8 || new TextEncoder().encode(data.password).length > 72)) {
			return t('restrictions.password.invalidLength');
		} else if (data.password && !/[a-z]/.test(data.password)) {
			return t('restrictions.password.missingLowercase');
		} else if (data.password && !/[A-Z]/.test(data.password)) {
			return t('restrictions.password.missingUppercase');
		} else if  (data.password && !/\d/.test(data.password)) {
			return t('restrictions.password.missingDigit');
		} else if (data.password && !/[\W_]/.test(data.password)) {
			return t('restrictions.password.missingSpecial');
		} else if (data.password && data.password !== cfPassword) {
			return t('restrictions.password.noMatch');
		} else if (!data.email) {
			return t('restrictions.email.required');
		} else if (data.email.length > 64) {
			return t('restrictions.email.invalidLength');
		} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
			return t('restrictions.email.invalidFormat');
		} else if (data.phone_number && !/^\+[1-9]\d{1,14}$/.test(data.phone_number)) {
			return t('restrictions.phoneNumber.invalidFormat');
		}

		return '';
	};

	const handleSubmit = e => {
		e.preventDefault();

		const submissionData = { ...formData };

		if (!submissionData.password) {
			delete submissionData.password;
		}

		const errorMessage = checkSecurityRestrictions(submissionData, cfPassword);

		if (errorMessage) {
			setError(errorMessage);
			setSuccess('');
		} else if (submissionData.password && has2FA) {
			setShowTwoFactorAuth(true);
		} else {
			setLoading(true);
			API.patch('users/@me/profile', submissionData)
				.then(() => {
					setSuccess(t('settings.security.successMessage'));
					setError('');
					GetUser()
						.then(user => {
							setUser(user);
						})
						.catch(err => {
							setError(err.response.data.error);
							setSuccess('');
						});
				})
				.catch(err => {
					setError(err.response.data.error);
					setSuccess('');
				})
				.finally(() => {
					setLoading(false);
				});
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
				{success && <SuccessMessage>{success}</SuccessMessage>}
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<PongButton type="submit" disabled={loading}>
					{loading ? t('settings.security.loadingButton') : t('settings.security.saveButton')}
				</PongButton>
			</Form>
			<TwoFactorAuthToggle user={user} handleChange={handleChange}/>
			{showTwoFactorAuth && (
				<TwoFactorAuthSecurity
					formData={formData}
					setUser={setUser}
					setSuccess={setSuccess}
					setShowTwoFactorAuth={setShowTwoFactorAuth}
				/>
			)}
		</>
	);
};

export default Security;
