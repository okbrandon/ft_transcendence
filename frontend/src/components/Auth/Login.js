import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { ApiLogin } from '../../api/auth';
import FortyTwoButton from '../../styles/shared/button/FortyTwoButton.styled';
import { AuthenticationContainer, FormContainer } from '../../styles/Auth/Authentication.styled';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
	const navigate = useNavigate();
	const { setIsLoggedIn } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// what if the user is already logged in and tries to go to this page ?

	const handleSubmit = (event) => {
		event.preventDefault();
		ApiLogin(username, password)
			.then(() => { setIsLoggedIn(true); navigate('/'); })
			.catch((error) => { setIsLoggedIn(false); console.log(error); });
	};
	const handleFortyTwo = (event) => {
		event.preventDefault();
		window.location.href = 'http://localhost/api/v1/auth/42/login';
	};

	return (
		<AuthenticationContainer>
			<FormContainer onSubmit={handleSubmit}>
				<h1>Login</h1>
				<FortyTwoButton variant='secondary' onClick={handleFortyTwo}><Image src='./images/42_Logo.png' alt='42 Logo'/>Login with 42</FortyTwoButton>
				<p>- Or -</p>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control id="id" type="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
				</FormContainer.Group>
				<FormContainer.Group className="mb-3">
					<FormContainer.Control id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
				</FormContainer.Group>
				<p>Not Signed Up ? <Link to="/signup">Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</FormContainer>
		</AuthenticationContainer>
	);
};

export default Login;
