import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	AuthenticationSection,
	FormContainer,
	LanguageDropdownButton,
	Outline,
	SubmitButton
} from './styles/Authentication.styled';
import FakeCaptcha from './FakeCaptcha';
import ErrorMessage from '../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';
import { Background } from '../Game/styles/Tournament/EndedTournament.styled';

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

	const handleChange = useCallback(e => {
		const { id, value } = e.target;

		setFormData(prevData => ({
			...prevData,
			[id]: value,
		}));
	}, []);

	const checkSignUpRestrictions = (data, cfPassword) => {
		const { username, email, password } = data;

		if (!username) { // username
			return t('restrictions.username.required');
		} else if (username.length < 4 || username.length > 16) {
			return t('restrictions.username.invalidLength');
		} else if (/[^a-zA-Z0-9]/.test(username)) {
			return t('restrictions.username.invalidCharacters');
		} else if (/42$/.test(username)) {
			return ('Username cannot end with 42');
		} else if (!email) { // email
			return t('restrictions.email.required');
		} else if (email.length > 64) {
			return t('restrictions.email.invalidLength');
		} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
			return t('restrictions.email.invalidFormat');
		} else if (!password) { // password
			return t('restrictions.password.required');
		} else if (new TextEncoder().encode(password).length < 8 || new TextEncoder().encode(password).length > 72) {
			return t('restrictions.password.invalidLength');
		} else if (!/[a-z]/.test(password)) {
			return t('restrictions.password.missingLowercase');
		} else if (!/[A-Z]/.test(password)) {
			return t('restrictions.password.missingUppercase');
		} else if (!/\d/.test(password)) {
			return t('restrictions.password.missingDigit');
		} else if (!/[\W_]/.test(password)) {
			return t('restrictions.password.missingSpecial');
		} else if (password !== cfPassword) {
			return t('restrictions.password.noMatch');
		}

		return '';
	};

	const handleSubmit = event => {
		event.preventDefault();
		const errorMessage = checkSignUpRestrictions(formData, cfPassword);
		if (errorMessage) {
			setError(errorMessage);
		} else {
			setShowFakeCaptcha(true);
		}
	};

	return (
		<AuthenticationSection>
			<Background>
				<span/>
				<span/>
				<span/>
				<span/>
				<span/>
				<span/>
				<span/>
				<span/>
			</Background>
			{!showFakeCaptcha ? (
				<Outline>
					<div className='card'>
						<div className='card2'>
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
									<div className='input-icon'>
										<i className="bi bi-person"/>
									</div>
									<FormContainer.Control
										id="username"
										type="username"
										placeholder={t('auth.signUp.usernameTitle')}
										value={formData.username}
										onChange={handleChange}
										isInvalid={error && error.includes(t('restrictions.username.errorKeyword'))}
										autoComplete='username'
									/>
								</FormContainer.Group>
								<FormContainer.Group className="mb-3">
									<div className='input-icon'>
										<i className='bi bi-envelope'/>
									</div>
									<FormContainer.Control
										id="email"
										type="email"
										placeholder={t('auth.signUp.emailTitle')}
										value={formData.email}
										onChange={handleChange}
										isInvalid={error && error.includes(t('restrictions.email.errorKeyword'))}
										autoComplete='email'
									/>
								</FormContainer.Group>
								<FormContainer.Group className="mb-3">
									<div className='input-icon'>
										<i className='bi bi-lock'/>
									</div>
									<FormContainer.Control
										id="password"
										type={showPassword ? 'text' : 'password'}
										placeholder={t('auth.signUp.passwordTitle')}
										value={formData.password}
										onChange={handleChange}
										isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
										autoComplete='new-password'
									/>
									<i className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye'}`} onClick={() => setShowPassword(prev => !prev)}/>
								</FormContainer.Group>
								<FormContainer.Group className="mb-3">
									<div className='input-icon'>
										<i className='bi bi-lock'/>
									</div>
									<FormContainer.Control
										id="cfpassword"
										type={showCfPassword ? 'text' : 'password'}
										placeholder={t('auth.signUp.confirmPasswordTitle')}
										value={cfPassword}
										onChange={e => setCfPassword(e.target.value)}
										isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
										autoComplete='new-password'
									/>
									<i className={`bi ${showCfPassword ? 'bi-eye-fill' : 'bi-eye'}`} onClick={() => setShowCfPassword(prev => !prev)}/>
								</FormContainer.Group>
								<p>{t('auth.signUp.alreadyRegistered')}<Link to="/signin">{t('auth.signUp.loginButton')}</Link></p>
								{error && <ErrorMessage>{error}</ErrorMessage>}
								<SubmitButton type='submit'>{t('auth.signUp.registerButton')}</SubmitButton>
							</FormContainer>
						</div>
					</div>
				</Outline>
			) : (
				<>
					<Outline>
						<div className='card'>
							<div className='card2'>
								<FakeCaptcha
									formData={formData}
									setShowFakeCaptcha={setShowFakeCaptcha}
									setErrorSignUp={setError}
								/>
							</div>
						</div>
					</Outline>
				</>
			)}
		</AuthenticationSection>
	);
};

export default SignUp;
