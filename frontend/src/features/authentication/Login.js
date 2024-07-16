import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import StyledForm from './styles/Form.styled';
import Container from '../../components/styles/Container.styled';
import BackButton from '../../components/styles/BackButton.styled';

const Login = () => {
	const handleSubmit = (event) => {
		event.preventDefault();
		alert('not functional yet');
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'font-size': '25px'}}></i></BackButton>
				<h1>Login</h1>
				<StyledForm.Group className="mb-3" controlId="formBasicEmail">
					<StyledForm.Control type="email" placeholder="Enter email" />
				</StyledForm.Group>
				<StyledForm.Group className="mb-3" controlId="formBasicPassword">
					<StyledForm.Control type="password" placeholder="Password" />
				</StyledForm.Group>
				<p>Not Signed Up ? <Link to='/signup'>Sign Up</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default Login;
