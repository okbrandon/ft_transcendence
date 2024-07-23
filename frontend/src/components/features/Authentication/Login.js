import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import StyledForm from '../../styles/layouts/Form.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/button/BackButton.styled';
import FortyTwoButton from '../../styles/shared/button/FortyTwoButton.styled';

const Login = () => {
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		navigate('/home');
	};
	const handleFortyTwoButton = (event) => {
		event.preventDefault();
		navigate('/home');
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'fontSize': '25px'}}></i></BackButton>
				<h1>Login</h1>
				<FortyTwoButton variant='secondary' onClick={handleFortyTwoButton}><Image src='./42_Logo.png' alt='42 Logo'/>Login with 42</FortyTwoButton>
				<p>- Or -</p>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="id" type="email" placeholder="Email / Username" required/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control id="password" type="password" placeholder="Password" required/>
				</StyledForm.Group>
				<p>Not Signed Up ? <Link to='/signup'>Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default Login;
