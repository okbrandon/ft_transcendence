import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ApiSignup } from '../../api/auth';
import { AuthenticationContainer, FormContainer } from '../../styles/Authentication.styled';
import NavBar from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

const SignUp = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [cfPassword, setCfPassword] = useState('');

	// what if the user is already logged in and tries to go to this page ?

	const handleSubmit = (event) => {
		event.preventDefault();
		ApiSignup(username, email, password)
			.then(() => { navigate('/login') })
			.catch((error) => { console.log(error); });
	};

	return (
		<>
			<NavBar/>
			<AuthenticationContainer>
				<FormContainer onSubmit={handleSubmit}>
					<h1>Sign Up</h1>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control id="id" type="username" placeholder="Username" required pattern='[a-zA-Z\-_]{3,20}' value={username} onChange={(e) => setUsername(e.target.value)}/>
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control id="mail" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
					</FormContainer.Group>
					<FormContainer.Group className="mb-3">
						<FormContainer.Control id="cfpassword" type="password" placeholder="Confirm Password" required value={cfPassword} onChange={(e) => setCfPassword(e.target.value)}/>
					</FormContainer.Group>
					<p>Already Signed Up ? <Link to="/login">Login</Link></p>
					<Button variant='success' type='submit'>Submit</Button>
				</FormContainer>
			</AuthenticationContainer>
			<Footer/>
		</>
	);
};

export default SignUp;
