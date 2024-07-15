import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPong from '../../components/ButtonPong';
import Stack from 'react-bootstrap/Stack';
import StyledHeader from '../../components/styles/Header.styled';
import Container from '../../components/styles/Container.styled';

const Authentication = () => {
	const navigate = useNavigate();

	const handleLogin = () => {
		navigate('/login');
	};
	const handleSignUp = () => {
		navigate('/signup');
	};

	return (
		<Container>
			<StyledHeader>PONG</StyledHeader>
			<Stack gap={5} className="mx-auto">
				<ButtonPong title="Login" variant="light" onClick={handleLogin}/>
				<ButtonPong title="Sign Up" variant="light" onClick={handleSignUp}/>
			</Stack>
		</Container>
	);
}

export default Authentication;
