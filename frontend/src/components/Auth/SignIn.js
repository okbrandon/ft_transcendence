import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import { apiLogin } from '../../api/auth';
import {
	AuthenticationSection,
	FormContainer,
	FortyTwoButton,
	Outline,
	SubmitButton
} from './styles/Authentication.styled';
import { useAuth } from '../../context/AuthContext';
import TwoFactorAuthSignIn from './TwoFactorAuthSignIn';
import ErrorMessage from '../../styles/shared/ErrorMessage.styled';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import { Background } from '../Game/styles/Tournament/EndedTournament.styled';

const SignIn = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn } = useAuth();
	const { addNotification } = useNotification();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
	const [availablePlatforms, setAvailablePlatforms] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	const toggleShowPassword = () => {
		setShowPassword(prev => !prev);
	};

	const handleSubmit = event => {
		event.preventDefault();
		if (loading) return;
		if (!username || !password) {
			setError(t('auth.signIn.errorMessage'));
			addNotification('error', t('auth.signIn.errorMessage'));
		} else {
			setLoading(true);
			apiLogin(username, password)
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
						addNotification('error', err.response.data.error);
					}
				});
		}
	};

	const handleFortyTwo = event => {
		event.preventDefault();
		window.location.href = process.env.REACT_APP_ENV === 'production' ? '/api/v1/auth/42/login' : 'http://localhost:8000/api/v1/auth/42/login';
	};

	const renderForm = () => (
		<Outline>
			<div className='card'>
				<div className='card2'>
					<FormContainer onSubmit={handleSubmit}>
						<h1>{t('auth.signIn.title')}</h1>
						<FortyTwoButton type='button' onClick={handleFortyTwo}>
							<Image src='/images/42-logo.webp' alt='42 Logo'/>
							{t('auth.signIn.fortyTwoProvider')}
						</FortyTwoButton>
						<p>{t('auth.signIn.providerDivider')}</p>
						<FormContainer.Group className="mb-3">
							<div className='input-icon'>
								<i className="bi bi-person"/>
							</div>
							<FormContainer.Control
								id="username"
								type="text"
								placeholder={t('auth.signIn.usernameTitle')}
								value={username}
								onChange={e => setUsername(e.target.value)}
								isInvalid={error && error.includes(t('restrictions.username.errorKeyword'))}
								autoComplete='username'
							/>
						</FormContainer.Group>
						<FormContainer.Group className="mb-3">
							<div className='input-icon'>
								<i className="bi bi-lock"/>
							</div>
							<FormContainer.Control
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder={t('auth.signIn.passwordTitle')}
								value={password}
								onChange={e => setPassword(e.target.value)}
								isInvalid={error && error.includes(t('restrictions.password.errorKeyword'))}
								autoComplete='current-password'
							/>
							<i className={`bi ${showPassword ? 'bi-eye-fill' : 'bi-eye'}`} onClick={toggleShowPassword}/>
						</FormContainer.Group>
						<p>{t('auth.signIn.notRegistered')}<Link to="/signup">{t('auth.signIn.registerButton')}</Link></p>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						<SubmitButton type='submit' disabled={loading}>{t('auth.signIn.loginButton')}</SubmitButton>
					</FormContainer>
				</div>
			</div>
		</Outline>
	);

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
			{!isTwoFactorAuth ? (
				renderForm()
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
