import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import StyledForm from '../../styles/features/Form.styled';
import Container from '../../styles/layouts/Container.styled';
import BackButton from '../../styles/shared/BackButton.styled';

const SignUp = () => {
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		navigate('/login');
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'font-size': '25px'}}></i></BackButton>
				<h1>Sign Up</h1>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="username" placeholder="Username" required pattern='[a-zA-Z\-\_]{3,20}'/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="email" placeholder="Email" required/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="password" placeholder="Password" required/>
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="password" placeholder="Confirm Password" required/>
				</StyledForm.Group>
				<p>Already Signed Up ? <Link to='/login'>Login</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default SignUp;
