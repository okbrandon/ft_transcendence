import React from 'react';
import ButtonPong from '../../components/ButtonPong';
import Stack from 'react-bootstrap/Stack';
import StyledHeader from '../../components/styles/Header.styled';
import Container from '../../components/styles/Container.styled';

const Authentication = () => {
	return (
		<Container>
			<StyledHeader>PONG</StyledHeader>
			<Stack gap={5} className="mx-auto">
				<ButtonPong title="Login"/>
				<ButtonPong title="Sign Up"/>
			</Stack>
		</Container>
	);
}

export default Authentication;