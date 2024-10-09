import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { ApiLogin } from '../../api/auth';
import {
	AuthenticationSection,
	FormContainer,
	FortyTwoButton
} from './styles/Authentication.styled';
import { useAuth } from '../../context/AuthContext';
import TwoFactorAuthSignIn from './TwoFactorAuthSignIn';
import ErrorMessage from '../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
	const [availablePlatforms, setAvailablePlatforms] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const { t } = useTranslation();

	const handleSubmit = event => {
		event.preventDefault();
		if (!username || !password) {
			setError(t('auth.signIn.errorMessage'));
		} else {
			ApiLogin(username, password)
				.then(() => {
					setIsLoggedIn(true);
					navigate('/');
				})
				.catch(err => {
					if (err.status === 400 && err.response.data.error.includes('OTP')) {
						setAvailablePlatforms(err.response.data.available_platforms);
						setIsTwoFactorAuth(true);
					} else {
						setError(err.response.data.error);
					}
				});
		}
	};

	const handleFortyTwo = event => {
		event.preventDefault();
		window.location.href = `/api/v1/auth/42/login`;
	};

	return (
		<AuthenticationSection>
			{!isTwoFactorAuth ? (
				<>
					<FormContainer onSubmit={handleSubmit}>
						<h1>{t('auth.signIn.title')}</h1>
						<FortyTwoButton variant='light' onClick={handleFortyTwo}>
							<Image src='/images/42_Logo.png' alt='42 Logo'/>
							{t('auth.signIn.fortyTwoProvider')}
						</FortyTwoButton>
						<p>{t('auth.signIn.providerDivider')}</p>
						<FormContainer.Group className="mb-3">
							<FormContainer.Control
								id="username"
								type="username"
								placeholder=" "
								value={username}
								onChange={e => setUsername(e.target.value)}
								isInvalid={error && error.includes(t('restrictions.username.errorKeyword'))}
								autoComplete='username'
							/>
							<span>{t('auth.signIn.usernameTitle')}</span>
						</FormContainer.Group>
						<FormContainer.Group className="mb-3">
							<FormContainer.Control
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder=" "
								value={password}
								onChange={e => setPassword(e.target.value)}
								isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
								autoComplete='current-password'
							/>
							<span>{t('auth.signIn.passwordTitle')}</span>
							{showPassword ? <i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)}/> : <i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)}/>}
						</FormContainer.Group>
						<p>{t('auth.signIn.notRegistered')}<Link to="/signup">{t('auth.signIn.registerButton')}</Link></p>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						<Button variant='light' type='submit'>{t('auth.signIn.loginButton')}</Button>
					</FormContainer>
				</>
			) : (
				<TwoFactorAuthSignIn
					username={username}
					password={password}
					setIsTwoFactorAuth={setIsTwoFactorAuth}
					availablePlatforms={availablePlatforms}
				/>
			)}
		</AuthenticationSection>
	);
};

export default SignIn;
