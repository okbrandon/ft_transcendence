import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import StyledForm from './styles/Form.styled';
import Container from '../../components/styles/Container.styled';
import BackButton from '../../components/styles/BackButton.styled';

const SignUp = () => {
	const handleSubmit = (event) => {
		event.preventDefault();
		alert('not functional yet');
	};

	return (
		<Container>
			<StyledForm onSubmit={handleSubmit}>
				<BackButton to='/'><i className='bi bi-arrow-left' style={{'font-size': '25px'}}></i></BackButton>
				<h1>Sign Up</h1>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="email" placeholder="Enter email" />
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="password" placeholder="Password" />
				</StyledForm.Group>
				<StyledForm.Group className="mb-3">
					<StyledForm.Control type="confirm" placeholder="Confirm Password" />
				</StyledForm.Group>
				<p>Already Signed Up ? <Link to='/login'>Login</Link></p>
				<Button variant='success' type='submit'>Submit</Button>
			</StyledForm>
		</Container>
	);
};

export default SignUp;
