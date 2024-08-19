import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ApiSignup } from '../../api/auth';
import { AuthenticationContainer, FormContainer } from '../../styles/Auth/Authentication.styled';

const SignUp = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [cfPassword, setCfPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		if (password !== cfPassword) {
			setError('Passwords do not match');
		} else {
			ApiSignup(username, email, password)
				.then(() => { navigate('/login') })
				.catch((error) => { console.log(error); });
		}
	};

	return (
		<AuthenticationContainer>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="id"
						type="username"
						required
						pattern='[a-zA-Z\-_]{3,20}'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<span>USERNAME</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="mail"
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<span>E-MAIL</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="password"
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<span>PASSWORD</span>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control
						id="cfpassword"
						type="password"
						required
						value={cfPassword}
						onChange={(e) => setCfPassword(e.target.value)}
					/>
					<span>CONFIRM</span>
				</FormContainer.Group>
				<p>Already Signed Up ? <Link to="/login">Login</Link></p>
				{error && <p style={{color: 'red'}}>{error}</p>}
				<Button variant='light' type='submit'>Submit</Button>
			</FormContainer>
		</AuthenticationContainer>
	);
};

export default SignUp;
