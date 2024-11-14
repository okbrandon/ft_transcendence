import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Navigation/Navigation';
import Chat from '../Chat/Chat';
import Footer from '../Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import RelationProvider from '../../context/RelationContext';
import ConnectedNavBar from '../Navigation/ConnectedNavigation';
import TournamentProvider from '../../context/TournamentContext';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from 'react-i18next';

const Root = () => {
	const location = useLocation();
	const { user, isLoggedIn, setUser, hasInteracted, setHasInteracted } = useAuth();
	const { addNotification } = useNotification();
	const [showPersistentUI, setShowPersistentUI] = useState(true);
	const [audio] = useState(new Audio('/sounds/pong-theme.mp3'));
	const [audioGame] = useState(new Audio('/sounds/pong-ingame.mp3'));
	const { t } = useTranslation();
	const tRef = useRef(t);

	const activateMusic = useCallback(() => {
		if (!hasInteracted) {
			setHasInteracted(true);
		}
	}, [hasInteracted, setHasInteracted]);

	useEffect(() => {
		setShowPersistentUI(!location.pathname.includes('/game'));

		audio.loop = true;

		document.body.addEventListener('click', activateMusic);

		return () => {
			document.body.removeEventListener('click', activateMusic);
		}
	}, [location, audio, activateMusic]);

	useEffect(() => {
		if (!user?.tournamentID) return;

		const leaveTournament = async () => {
			try {
				await API.delete(`/tournaments/@me`);
				addNotification('info', tRef.current('game.tournaments.leaveMessage'));
			} catch (error) {
				addNotification('error', error?.response?.data?.error || 'Error leaving tournament');
			}
		};
		if (!location.pathname.includes(`/tournaments/${user.tournamentID}`)) {
			leaveTournament();
		}
	}, [location, user?.tournamentID, addNotification, setUser]);

	useEffect(() => {
		if (hasInteracted && showPersistentUI && isLoggedIn) {
			audioGame.pause();
			audioGame.currentTime = 0;
			audio.volume = 0.2;
			audio.play();
		} else if (hasInteracted && !showPersistentUI && isLoggedIn) {
			audio.pause();
			audio.currentTime = 0;
			audioGame.volume = 0.2;
			audioGame.play();
		} else if (showPersistentUI && !isLoggedIn) {
			audio.pause();
			audio.currentTime = 0;
		}
	}, [hasInteracted, showPersistentUI, audio, isLoggedIn, audioGame]);

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
