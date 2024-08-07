import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from 'react-bootstrap/esm/Stack';
import Container from '../../styles/layouts/Container.styled';
import PongButton from '../../shared/PongButton';

const PlayMenu = () => {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/home');
	};
	const handleSoloVsAI = () => {
		navigate('/solo-vs-ai');
	};

	return (
		<Container>
			<Stack gap={5} className='mx-auto'>
				<PongButton title='SOLO VS AI' variant='light' onClick={handleSoloVsAI}/>
				<PongButton title='1 V 1' variant='light'/>
				<PongButton title='TOURNAMENT' variant='light'/>
				<PongButton title='BACK' variant='light' onClick={handleBack}/>
			</Stack>
		</Container>
	);
};

export default PlayMenu;
