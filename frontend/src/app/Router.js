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
import Game from '../components/Game/Game';
import Home from '../components/Home/Home';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Profile from '../components/Profile/Profile';
import Verify from '../components/Auth/Verify';
import Callback from '../components/Auth/Callback';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import PlayMenu from '../components/Game/PlayMenu';
import Shop from '../components/Shop/Shop';
import Tournament from '../components/Game/Tournament/Tournament';
import JoinTournament from '../components/Game/Tournament/JoinTournament';
import Match from '../components/Game/Match';
import Friends from '../components/Friends/Friends';
import PageNotFound from '../components/PageNotFound/PageNotFound';
import Settings from '../components/Settings/Settings';
import GameProvider from '../context/GameContext';

const PrivateRoutes = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		setIsLoggedIn(isValidToken());
	}, [setIsLoggedIn]);
	return (
		isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
	);
};

const GameRoutes = () => {
	return (
		<GameProvider>
			<Outlet/>
		</GameProvider>
	);
};

const Router = createBrowserRouter(createRoutesFromElements(
	<>
		<Route path="/" element={ <Root/> }>
			<Route index element={ <Home/> }/>
			<Route path="login/:fromSignUp?" element={ <SignIn/> }/>
			<Route path="signup" element={ <SignUp/> }/>
			<Route element={ <PrivateRoutes/> }>
				<Route path="friends" element={ <Friends/> }/>
				<Route path="profile/:username" element={ <Profile/> }/>
				<Route path="settings" element={ <Settings/> }/>
				<Route path="shop" element={ <Shop/> }/>
				<Route path="playmenu" element={ <PlayMenu/> }/>
				<Route path="tournament" element={ <Tournament/> }/>
				<Route path="tournament-room" element={ <JoinTournament/> }/> {/* ⚒️ testing... */}
				<Route element={ <GameRoutes/> }>
					<Route path="matchmaking" element={ <Match/> }/>
					<Route path="game" element={ <Game/> }/>
				</Route>
				<Route path="leaderboard" element={ <Leaderboard/> }/>
			</Route>
		</Route>
		<Route path="callback" element={ <Callback/> }/>
		<Route path="verify" element={ <Verify/> }/>
		<Route path="*" element={ <PageNotFound/> }/>
	</>
));

export default Router;
