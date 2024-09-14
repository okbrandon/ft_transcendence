import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { ApiLogin } from '../../api/auth';
import { AuthenticationSection, ErrorMessage, FormContainer, FortyTwoButton } from './styles/Authentication.styled';
import { AuthContext } from '../../context/AuthContext';

const SignIn = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
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
					setError(err.response.data.error);
					setIsLoggedIn(false);
				});
		}
	};
	const handleFortyTwo = (event) => {
		event.preventDefault();
		window.location.href = `http://localhost:8888/api/v1/auth/42/login`;
	};

	return (
		<AuthenticationSection>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Sign In</h1>
				<FortyTwoButton variant='light' onClick={handleFortyTwo}><Image src='/images/42_Logo.png' alt='42 Logo'/>SignIn with 42</FortyTwoButton>
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
						type="password"
						placeholder=" "
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						isInvalid={error && error.includes('password')}
						autoComplete='current-password'
					/>
					<span>PASSWORD</span>
				</FormContainer.Group>
				<p>Not Signed Up ? <Link to="/signup">Sign Up</Link></p>
				{error && <ErrorMessage>{error}</ErrorMessage>}
				<Button variant='light' type='submit'>Submit</Button>
			</FormContainer>
		</AuthenticationSection>
	);
};

export default SignIn;
