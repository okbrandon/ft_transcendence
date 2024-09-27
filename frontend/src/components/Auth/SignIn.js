import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { ApiLogin } from '../../api/auth';
import {
	AuthenticationSection,
	ErrorMessage,
	FormContainer,
	FortyTwoButton
} from './styles/Authentication.styled';
import { AuthContext } from '../../context/AuthContext';
import TwoFactorAuth from './TwoFactorAuthSignIn';
import Notification from '../Notification/Notification';

const SignIn = () => {
	const navigate = useNavigate();
	const { fromSignUp } = useParams();
	const notificationRef = useRef(null);
	const { setIsLoggedIn } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
	const [availablePlatforms, setAvailablePlatforms] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = event => {
		event.preventDefault();
		if (!username || !password) {
			setError('Please enter a username and a password.');
		} else {
			ApiLogin(username, password)
				.then(() => {
					setIsLoggedIn(true);
					navigate('/');
				})
				.catch((err) => {
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
		window.location.href = `http://localhost:8888/api/v1/auth/42/login`;
	};

	useEffect(() => {
		if (fromSignUp && notificationRef.current) {
			notificationRef.current.addNotification(
				'success',
				'Please check your email to verify your account.'
			);
		}
	}, [fromSignUp]);

	return (
		<AuthenticationSection>
			{!isTwoFactorAuth ? (
				<>
					<FormContainer onSubmit={handleSubmit}>
						<h1>Sign In</h1>
						<FortyTwoButton variant='light' onClick={handleFortyTwo}>
							<Image src='/images/42_Logo.png' alt='42 Logo'/>
							SignIn with 42
						</FortyTwoButton>
						<p>- Or -</p>
						<FormContainer.Group className="mb-3">
							<FormContainer.Control
								id="username"
								type="username"
								placeholder=" "
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								isInvalid={error && error.includes('username')}
								autoComplete='username'
							/>
							<span>USERNAME</span>
						</FormContainer.Group>
						<FormContainer.Group className="mb-3">
							<FormContainer.Control
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder=" "
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								isInvalid={error && error.includes('password')}
								autoComplete='current-password'
							/>
							<span>PASSWORD</span>
							{showPassword ? <i className="bi bi-eye-fill" onClick={() => setShowPassword(!showPassword)}/> : <i className="bi bi-eye" onClick={() => setShowPassword(!showPassword)}/>}
						</FormContainer.Group>
						<p>Not Signed Up ? <Link to="/signup">Sign Up</Link></p>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						<Button variant='light' type='submit'>Submit</Button>
					</FormContainer>
					<Notification ref={notificationRef}/>
				</>
			) : (
				<TwoFactorAuth
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
