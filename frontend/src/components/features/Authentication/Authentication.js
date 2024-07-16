import React from 'react';
import { useNavigate } from 'react-router-dom';
import PongButton from '../../shared/PongButton';
import Stack from 'react-bootstrap/Stack';
import { PongBall, PongBar } from '../../styles/layouts/PongBackground.styled';
import Header from '../../styles/shared/Header.styled';
import Container from '../../styles/layouts/Container.styled';

const Authentication = () => {
	const navigate = useNavigate();

	const handleLogin = () => {
		navigate('/login');
	};
	const handleSignUp = () => {
		navigate('/signup');
	};

	return (
		<>
			<PongBar/>
			<PongBall/>
			<Container>
				<Header>PONG</Header>
				<Stack gap={5} className="mx-auto">
					<PongButton title="Login" variant="light" onClick={handleLogin}/>
					<PongButton title="Sign Up" variant="light" onClick={handleSignUp}/>
				</Stack>
			</Container>
		</>
	);
};

export default Authentication;
