import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import PongButton from '../../shared/PongButton';
import Container from '../../styles/layouts/Container.styled';
import Header from '../../styles/shared/Header.styled';

const MainMenu = () => {
	const navigate = useNavigate();

	const handlePlay = () => {
		navigate('play');
	};

	return (
		<>
			<Container>
				<Header>PONG</Header>
				<Stack gap={5} className='mx-auto'>
					<PongButton title='Play' variant='light' onClick={handlePlay}/>
					<PongButton title='Settings' variant='light'/>
				</Stack>
			</Container>
		</>
	);
};

export default MainMenu;
