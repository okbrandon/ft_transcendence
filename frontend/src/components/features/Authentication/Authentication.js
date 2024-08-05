import React from 'react';
import { useNavigate } from 'react-router-dom';
import PongButton from '../../shared/PongButton';
import Stack from 'react-bootstrap/Stack';
import { PongBallBackground, PongPaddleBackground } from '../../styles/animations/PongBackground.styled';
import Title from '../../styles/shared/Title.styled';
import Container from '../../styles/layouts/Container.styled';
import { AnimatePresence, motion } from 'framer-motion';

const Authentication = () => {
	const navigate = useNavigate();

	return (
		<AnimatePresence>
			<motion.div
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				transition={{duration: 1.5}}>
				<PongPaddleBackground/>
				<PongBallBackground/>
				<Container>
					<Title>PONG</Title>
					<Stack gap={5} className="mx-auto">
						<PongButton title="Login" variant="light" onClick={() => { navigate('/login') }}/>
						<PongButton title="Sign Up" variant="light" onClick={() => { navigate('/signup') }}/>
					</Stack>
				</Container>
			</motion.div>
		</AnimatePresence>
	);
};

export default Authentication;
