import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ApiSignup } from '../../api/auth';
import { AuthenticationSection, ErrorMessage, FormContainer } from './styles/Authentication.styled';

const SignUp = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [cfPassword, setCfPassword] = useState('');
	const [error, setError] = useState('');

	const validateForm = () => {
		let errorMessage = '';

		// else if (lang.length !== 2 || !['en', 'fr', 'es'].includes(lang)) {
		// 	errorMessage = 'Unsupported language, must be either "en", "fr", or "es".';

		if (!username) {
			errorMessage = 'Username is required.';
		} else if (username.length < 4) {
			errorMessage = 'Username must be at least 4 characters long.';
		} else if (username.length > 16) {
			errorMessage = 'Username cannot be longer than 16 characters.';
		} else if (!email) {
			errorMessage = 'Email is required.';
		} else if (email.length > 64) {
			errorMessage = 'Email cannot be longer than 64 characters.';
		} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
			errorMessage = 'Invalid Email address, did not match the required format.';
		} else if (!password) {
			errorMessage = 'Password is required.';
		} else if (password.length < 8) {
			errorMessage = 'Password must be at least 8 characters long.';
		} else if (new TextEncoder().encode(password).length > 72) {
			errorMessage = 'Password cannot be longer than 72 bytes.';
		} else if (password !== cfPassword) {
			errorMessage = 'Passwords do not match.';
		}

		return errorMessage;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const errorMessage = validateForm();
		if (errorMessage) {
			setError(errorMessage);
		} else {
			ApiSignup(username, email, password)
				.then(() => {
					navigate('/login')
				})
				.catch((error) => {
					setError('An error occurred during signup. Please try again.');
					console.log(error);
				});
		}
	};

	return (
		<AuthenticationSection>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="id"
						type="username"
						placeholder=" "
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						isInvalid={error && error.includes('Username')}
					/>
					<span>USERNAME</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="email"
						type="email"
						placeholder=" "
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						isInvalid={error && error.includes('Email')}
					/>
					<span>E-MAIL</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="password"
						type="password"
						placeholder=" "
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						isInvalid={error && error.includes('Password')}
					/>
					<span>PASSWORD</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="cfpassword"
						type="password"
						placeholder=" "
						value={cfPassword}
						onChange={(e) => setCfPassword(e.target.value)}
						isInvalid={error && error.includes('Passwords')}
					/>
					<span>CONFIRM</span>
				</FormContainer.Group>
				<p>Already Signed Up ? <Link to="/login">Sign In</Link></p>
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<Button variant='light' type='submit'>Submit</Button>
			</FormContainer>
		</AuthenticationSection>
	);
};

export default SignUp;
