import React from 'react';
import ButtonPong from '../../components/ButtonPong';
import StyledHeader from '../../components/styles/Header.styled';
import ButtonContainer from '../../components/styles/ButtonContainer.styled';

const Authentication = () => {
	return (
		<>
			<StyledHeader>PONG.</StyledHeader>
			<ButtonContainer>
				<ButtonPong title="Login"/>
				<ButtonPong title="Sign Up"/>
			</ButtonContainer>
		</>
	);
}

export default Authentication;