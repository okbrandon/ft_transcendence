import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import StyledForm from '../../styles/features/Form.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/BackButton.styled';
import FortyTwoLoginButton from '../../styles/features/FortyTwoLogin.styled';

const Login = () => {
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		navigate('/mainmenu');
	};
	const handleFortyTwoLogin = (event) => {
		event.preventDefault();
		navigate('/mainmenu');
	}

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'font-size': '25px'}}></i></BackButton>
				<h1>Login</h1>
				<FortyTwoLoginButton variant='secondary' onClick={handleFortyTwoLogin}><Image src='./42_Logo.png' alt='42 Logo'/>Login with 42</FortyTwoLoginButton>
				<p>- Or -</p>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="email" placeholder="Email / Username" required/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="password" placeholder="Password" required/>
				</StyledForm.Group>
				<p>Not Signed Up ? <Link to='/signup'>Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default Login;
