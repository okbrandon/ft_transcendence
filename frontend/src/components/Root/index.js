import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Chat from '../Chat/Chat';
import Footer from '../Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import RelationProvider from '../../context/RelationContext';
import ConnectedNavBar from '../Navigation/ConnectedNavigation';
import TournamentProvider from '../../context/TournamentContext';

const Root = () => {
	const location = useLocation();
	const { isLoggedIn } = useAuth();
	const [showPersistentUI, setShowPersistentUI] = useState(true);
	const [hasInteracted, setHasInteracted] = useState(false);
	const [audio] = useState(new Audio('/sounds/pong-theme.mp3'));

	const activateMusic = useCallback(() => {
		if (!hasInteracted) {
			setHasInteracted(true);
		}
	}, [hasInteracted]);

	useEffect(() => {
		setShowPersistentUI(!location.pathname.includes('/game'));

		audio.loop = true;
		audio.volume = 0.1;

		document.body.addEventListener('click', activateMusic);

		return () => {
			document.body.removeEventListener('click', activateMusic);
		}
	}, [location, audio, activateMusic]);

	useEffect(() => {
		if (hasInteracted && showPersistentUI && isLoggedIn) {
			audio.play();
		} else if (!showPersistentUI) {
			audio.pause();
		}
	}, [hasInteracted, showPersistentUI, audio, isLoggedIn]);

	return (
		<>
			{isLoggedIn ? (
				<TournamentProvider>
					<RelationProvider>
						{showPersistentUI && <ConnectedNavBar/>}
						<main>
							<Chat/>
							<Outlet/>
						</main>
						{showPersistentUI && <Footer/>}
					</RelationProvider>
				</TournamentProvider>
			) : (
				<>
					{showPersistentUI && <NavBar/>}
					<main>
						<Outlet/>
					</main>
					{showPersistentUI && <Footer/>}
				</>
			)}
		</>
	);
};

export default Root;
