import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import AuthenticationContainer from '../../styles/layouts/AuthenticationContainer.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';
import FortyTwoButton from '../../styles/shared/button/FortyTwoButton.styled';
import { ApiLogin } from '../../../api/auth';

const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		ApiLogin(username, password)
			.then(() => { navigate('/'); })
			.catch((error) => { console.log(error); });
	};
	const handleFortyTwo = (event) => {
		event.preventDefault();
		navigate('/');
	};

	return (
		<Container>
			<AuthenticationContainer onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'fontSize': '25px'}}></i></BackButton>
				<h1>Login</h1>
				<FortyTwoButton variant='secondary' onClick={handleFortyTwo}><Image src='./images/42_Logo.png' alt='42 Logo'/>Login with 42</FortyTwoButton>
				<p>- Or -</p>
				<AuthenticationContainer.Group className="mb-3">
					<AuthenticationContainer.Control id="id" type="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
				</AuthenticationContainer.Group>
				<AuthenticationContainer.Group className="mb-3">
					<AuthenticationContainer.Control id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
				</AuthenticationContainer.Group>
				<p>Not Signed Up ? <Link to='/signup'>Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</AuthenticationContainer>
		</Container>
	);
};

export default Login;
