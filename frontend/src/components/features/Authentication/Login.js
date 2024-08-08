import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import StyledForm from '../../styles/layouts/Form.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';
import FortyTwoButton from '../../styles/shared/button/FortyTwoButton.styled';

const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		let data = {
			username: username,
			password: password
		};
		// GET, PATCH, POST, etc...
		let response = fetch('http://localhost:8000/api/v1/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			}, // requetes que l'utilisateur fait, il faut un autre header
			body: JSON.stringify(data),
		}).then((response) => {
			if (response.status === 200) {
				response.json().then(res => {
					console.log(res); // Log the content of the body
					localStorage.setItem('token', res.access);
					localStorage.setItem('refresh', res.refresh);
					navigate('/home');
				});
			} else {
				alert('pasteque vs melon');
			}
		}).catch((error) => {
			console.error('Error:', error);
		});
	};
	const handleFortyTwoButton = (event) => {
		event.preventDefault();
		window.location.href = 'http://localhost:8000/api/v1/auth/42/login';
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'fontSize': '25px'}}></i></BackButton>
				<h1>Login</h1>
				<FortyTwoButton variant='secondary' onClick={handleFortyTwoButton}><Image src='./42_Logo.png' alt='42 Logo'/>Login with 42</FortyTwoButton>
				<p>- Or -</p>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="id" type="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
				</StyledForm.Group>
				<p>Not Signed Up ? <Link to='/signup'>Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default Login;
