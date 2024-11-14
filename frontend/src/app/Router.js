import React, { useEffect } from 'react';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';
import { isValidToken } from '../api/api';
import Root from '../components/Root';
import SignIn from '../components/Auth/SignIn';
import SignUp from '../components/Auth/SignUp';
import Game from '../components/Game/remote/Game';
import Home from '../components/Home/Home';
import Profile from '../components/Profile/Profile';
import Verify from '../components/Auth/Verify';
import Callback from '../components/Auth/Callback';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import PlayMenu from '../components/Game/PlayMenu';
import Shop from '../components/Shop/Shop';
import Tournament from '../components/Game/Tournament/Tournament';
import JoinTournament from '../components/Game/Tournament/JoinTournament';
import Friends from '../components/Friends/Friends';
import PageNotFound from '../components/PageNotFound/PageNotFound';
import Settings from '../components/Settings/Settings';
import { useAuth } from '../context/AuthContext';
import GameLocal from '../components/Game/local/GameLocal';
import GameTournament from '../components/Game/Tournament/GameTournament';
import CreateTournament from '../components/Game/Tournament/CreateTournament';
import EndedTournament from '../components/Game/Tournament/EndedTournament';
import Privacy from '../components/Privacy/Privacy';

const PrivateRoutes = () => {
	const { isLoggedIn, setIsLoggedIn } = useAuth();

	useEffect(() => {
		setIsLoggedIn(isValidToken());
	}, [setIsLoggedIn]);

	return (
		isLoggedIn ? <Outlet/> : <Navigate to="/signin"/>
	);
};

const AuthenticationRoutes = () => {
	const { isLoggedIn, setIsLoggedIn } = useAuth();

	useEffect(() => {
		setIsLoggedIn(isValidToken());
	}, [setIsLoggedIn]);

	return (
		isLoggedIn ? <Navigate to="/"/> : <Outlet/>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<>
		<Route path="/" element={ <Root/> }>
			<Route index element={ <Home/> }/>
			<Route path="privacy-policy" element={ <Privacy/> }/>
			<Route element={ <AuthenticationRoutes/> }>
				<Route path="signin" element={ <SignIn/> }/>
				<Route path="signup" element={ <SignUp/> }/>
			</Route>
			<Route element={ <PrivateRoutes/> }>
				<Route path="friends" element={ <Friends/> }/>
				<Route path="leaderboard" element={ <Leaderboard/> }/>
				<Route path="profile/:username" element={ <Profile/> }/>
				<Route path="settings" element={ <Settings/> }/>
				<Route path="shop" element={ <Shop/> }/>
				<Route path="tournaments" element={ <Tournament/> }/>
				<Route path="tournaments/create" element={ <CreateTournament /> }/>
				<Route path="tournaments/:tournamentID" element={ <JoinTournament/> }/>
				<Route path="tournaments/:tournamentID/results" element={ <EndedTournament /> }/>
				<Route path="tournaments/:tournamentID/game" element={ <GameTournament /> }/>
				<Route path="game-classic" element={ <Game/> }/>
				<Route path="game-ai" element={ <Game/> }/>
				<Route path="game-challenge" element={ <Game/> }/>
				<Route path="playmenu" element={ <PlayMenu/> }/>
				<Route path="game-local" element={ <GameLocal/> }/>
			</Route>
		</Route>
		<Route path="callback" element={ <Callback/> }/>
		<Route path="verify" element={ <Verify/> }/>
		<Route path="*" element={ <PageNotFound/> }/>
	</>
));

export default Router;
