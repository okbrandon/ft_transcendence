import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ApiSignup } from '../../api/auth';
import { AuthenticationSection, ErrorMessage, FormContainer, LanguageDropdownButton } from './styles/Authentication.styled';
import { checkSignUpRestrictions } from '../../scripts/restrictions';

const SignUp = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		lang: 'en',
	});
	const [cfPassword, setCfPassword] = useState('');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { id, value } = e.target;

		setFormData(prevData => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const errorMessage = checkSignUpRestrictions(formData, cfPassword);
		if (errorMessage) {
			setError(errorMessage);
		} else {
			ApiSignup(formData)
				.then(() => {
					navigate('/login/send-email-notification');
				})
				.catch((error) => {
					setError(error.response.data.error);
				});
		}
	};

	return (
		<AuthenticationSection>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				<LanguageDropdownButton
					id="lang"
					value={formData.lang}
					onChange={handleChange}
					autoComplete='off'
				>
					<option value="en">🇬🇧 English</option>
					<option value="es">🇪🇸 Español</option>
					<option value="fr">🇫🇷 Français</option>
				</LanguageDropdownButton>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="username"
						type="username"
						placeholder=" "
						value={formData.username}
						onChange={handleChange}
						isInvalid={error && error.includes('Username')}
						autoComplete='username'
					/>
					<span>USERNAME</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="email"
						type="email"
						placeholder=" "
						value={formData.email}
						onChange={handleChange}
						isInvalid={error && error.includes('Email')}
						autoComplete='email'
					/>
					<span>E-MAIL</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="password"
						type="password"
						placeholder=" "
						value={formData.password}
						onChange={handleChange}
						isInvalid={error && error.includes('Password')}
						autoComplete='new-password'
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
						autoComplete='new-password'
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
