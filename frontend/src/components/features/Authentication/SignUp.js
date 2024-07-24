import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import StyledForm from '../../styles/layouts/Form.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';

const SignUp = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [cfPassword, setCfPassword] = useState('');

	const handleSubmit = (event) => {
		alert('triggered');
		event.preventDefault();
		let data = {
			username: username,
			email: email,
			password: password,
			lang: 'fr'
		};
		let response = fetch('http://localhost:8000/api/v1/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		// navigate('/home');
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'fontSize': '25px'}}></i></BackButton>
				<h1>Sign Up</h1>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="id" type="username" placeholder="Username" required pattern='[a-zA-Z\-\_]{3,20}' value={username} onChange={(e) => setUsername(e.target.value)}/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="mail" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="cfpassword" type="password" placeholder="Confirm Password" required value={cfPassword} onChange={(e) => setCfPassword(e.target.value)}/>
				</StyledForm.Group>
				<p>Already Signed Up ? <Link to='/login'>Login</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default SignUp;
