import React from 'react';
import StyledForm from './styles/Form.styled';
import Container from '../../components/styles/Container.styled';

const Login = () => {
	return (
		<Container>
			<StyledForm>
				<StyledForm.Group className="mb-3" controlId="formBasicEmail">
					<StyledForm.Label htmlFor='mailInput'>Email address</StyledForm.Label>
					<StyledForm.Control id='mailInput' type="email" placeholder="Enter email" />
				</StyledForm.Group>
				<StyledForm.Group className="mb-3" controlId="formBasicPassword">
					<StyledForm.Label htmlFor='passwordInput'>Password</StyledForm.Label>
					<StyledForm.Control id='passwordInput' type="password" placeholder="Password" />
				</StyledForm.Group>
			</StyledForm>
		</Container>
	);
}

export default Login;
