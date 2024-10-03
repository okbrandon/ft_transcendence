import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ApiSignup } from '../../api/auth';
import { AuthenticationSection, FormContainer, LanguageDropdownButton } from './styles/Authentication.styled';
import FakeCaptcha from './FakeCaptcha';
import ErrorMessage from '../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		lang: 'EN',
	});
	const [cfPassword, setCfPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showCfPassword, setShowCfPassword] = useState(false);
	const [showFakeCaptcha, setShowFakeCaptcha] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	const handleChange = (e) => {
		const { id, value } = e.target;

		setFormData(prevData => ({
			...prevData,
			[id]: value,
		}));
	};

	const checkSignUpRestrictions = (data, cfPassword) => {
		if (!data) {
			return '';
		}

		if (!data.username) { // username
			return t('restrictions.username.required');
		} else if (data.username.length < 4 || data.username.length > 16) {
			return t('restrictions.username.invalidLength');
		} else if (/[^a-zA-Z0-9]/.test(data.username)) {
			return t('restrictions.username.invalidCharacters');
		} else if (!data.email) { // email
			return t('restrictions.email.required');
		} else if (data.email.length > 64) {
			return t('restrictions.email.invalidLength');
		} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
			return t('restrictions.email.invalidFormat');
		} else if (!data.password) { // password
			return t('restrictions.password.required');
		} else if (new TextEncoder().encode(data.password).length < 8 || new TextEncoder().encode(data.password).length > 72) {
			return t('restrictions.password.invalidLength');
		} else if (!/[a-z]/.test(data.password)) {
			return t('restrictions.password.missingLowercase');
		} else if (!/[A-Z]/.test(data.password)) {
			return t('restrictions.password.missingUppercase');
		} else if (!/\d/.test(data.password)) {
			return t('restrictions.password.missingDigit');
		} else if (!/[\W_]/.test(data.password)) {
			return t('restrictions.password.missingSpecial');
		} else if (data.password !== cfPassword) {
			return t('restrictions.password.noMatch');
		}

		return '';
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const errorMessage = checkSignUpRestrictions(formData, cfPassword);
		if (errorMessage) {
			setError(errorMessage);
		} else {
			ApiSignup(formData)
				.then(() => {
					setShowFakeCaptcha(true);
				})
				.catch((error) => {
					setError(error.response.data.error);
				});
		}
	};

	return (
		<AuthenticationSection>
			{!showFakeCaptcha ? (
				<FormContainer onSubmit={handleSubmit}>
					<h1>{t('auth.signUp.title')}</h1>
					<LanguageDropdownButton
						id="lang"
						value={formData.lang}
						onChange={handleChange}
						autoComplete='off'
					>
						<option value="EN">🇬🇧 English</option>
						<option value="ES">🇪🇸 Español</option>
						<option value="FR">🇫🇷 Français</option>
					</LanguageDropdownButton>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control
							id="username"
							type="username"
							placeholder=" "
							value={formData.username}
							onChange={handleChange}
							isInvalid={error && error.includes(t('restrictions.username.errorKeyword'))}
							autoComplete='username'
						/>
						<span>{t('auth.signUp.usernameTitle')}</span>
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control
							id="email"
							type="email"
							placeholder=" "
							value={formData.email}
							onChange={handleChange}
							isInvalid={error && error.includes(t('restrictions.email.errorKeyword'))}
							autoComplete='email'
						/>
						<span>{t('auth.signUp.emailTitle')}</span>
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder=" "
							value={formData.password}
							onChange={handleChange}
							isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
							autoComplete='new-password'
						/>
						<span>{t('auth.signUp.passwordTitle')}</span>
						{showPassword ? (
							<i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)}/>
						) : (
							<i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)}/>
						)}
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control
							id="cfpassword"
							type={showCfPassword ? 'text' : 'password'}
							placeholder=" "
							value={cfPassword}
							onChange={(e) => setCfPassword(e.target.value)}
							isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
							autoComplete='new-password'
						/>
						<span>{t('auth.signUp.confirmPasswordTitle')}</span>
						{showCfPassword ? (
							<i className="bi bi-eye-fill" onClick={() => setShowCfPassword(!showCfPassword)}/>
						) : (
							<i className="bi bi-eye" onClick={() => setShowCfPassword(!showCfPassword)}/>
						)}
					</FormContainer.Group>
					<p>{t('auth.signUp.alreadyRegistered')}<Link to="/signin">{t('auth.signUp.loginButton')}</Link></p>
					{error && <ErrorMessage>{error}</ErrorMessage>}
					<Button variant='light' type='submit'>{t('auth.signUp.registerButton')}</Button>
				</FormContainer>
			) : <FakeCaptcha/>}
		</AuthenticationSection>
	);
};

export default SignUp;
